// backend/prisma/seed.ts
import { PrismaClient, UserRole, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1) Subscriptions (tier is unique in your schema)
  const free = await prisma.subscription.upsert({
    where: { tier: 'FREE' },
    update: {
      allowedAppointmentsPerMonth: 2,
      priceCents: 0,
      durationDays: 30,
    },
    create: {
      tier: 'FREE',
      allowedAppointmentsPerMonth: 2,
      priceCents: 0,
      durationDays: 30,
    },
  });

  const basic = await prisma.subscription.upsert({
    where: { tier: 'BASIC' },
    update: {
      allowedAppointmentsPerMonth: 5,
      priceCents: 999,
      durationDays: 30,
    },
    create: {
      tier: 'BASIC',
      allowedAppointmentsPerMonth: 5,
      priceCents: 999,
      durationDays: 30,
    },
  });

  const premium = await prisma.subscription.upsert({
    where: { tier: 'PREMIUM' },
    update: {
      allowedAppointmentsPerMonth: -1,
      priceCents: 2499,
      durationDays: 30,
    },
    create: {
      tier: 'PREMIUM',
      allowedAppointmentsPerMonth: -1, // -1 = unlimited
      priceCents: 2499,
      durationDays: 30,
    },
  });

  // 2) Users (use email unique)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medportal.test' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@medportal.test',
      role: UserRole.ADMIN,
      password: await bcrypt.hash('admin123', 10),
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@medportal.test' },
    update: {},
    create: {
      name: 'Dr. Sarah Johnson',
      email: 'doctor@medportal.test',
      role: UserRole.DOCTOR,
      password: await bcrypt.hash('doctor123', 10),
    },
  });

  const patient1 = await prisma.user.upsert({
    where: { email: 'patient@medportal.test' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'patient@medportal.test',
      role: UserRole.PATIENT,
      password: await bcrypt.hash('patient123', 10),
    },
  });

  const patient2 = await prisma.user.upsert({
    where: { email: 'patient2@medportal.test' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'patient2@medportal.test',
      role: UserRole.PATIENT,
      password: await bcrypt.hash('patient123', 10),
    },
  });

  // 3) Assign subscriptions to patients
  // Use findFirst to avoid issues with composite upsert keys.
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(now.getDate() + 30);

  const existingSub1 = await prisma.userSubscription.findFirst({
    where: { userId: patient1.id, subscriptionId: free.id },
  });
  if (!existingSub1) {
    await prisma.userSubscription.create({
      data: {
        userId: patient1.id,
        subscriptionId: free.id,
        startedAt: now,
        expiresAt: expires,
        active: true,
      },
    });
  }

  const existingSub2 = await prisma.userSubscription.findFirst({
    where: { userId: patient2.id, subscriptionId: basic.id },
  });
  if (!existingSub2) {
    await prisma.userSubscription.create({
      data: {
        userId: patient2.id,
        subscriptionId: basic.id,
        startedAt: now,
        expiresAt: expires,
        active: true,
      },
    });
  }

  // 4) Availability slots for doctor
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // create 5 days of 9-11am slots (2 slots per day) to keep seed small
  for (let i = 0; i < 5; i++) {
    const slotDay = new Date(tomorrow);
    slotDay.setDate(tomorrow.getDate() + i);

    for (let hour = 9; hour < 12; hour++) {
      const startTime = new Date(slotDay);
      startTime.setHours(hour, 0, 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(hour + 1, 0, 0, 0);

      // avoid duplicates by checking if slot exists
      const exists = await prisma.availabilitySlot.findFirst({
        where: {
          doctorId: doctor.id,
          startTime,
        },
      });

      if (!exists) {
        await prisma.availabilitySlot.create({
          data: {
            doctorId: doctor.id,
            startTime,
            endTime,
            isBooked: false,
          },
        });
      }
    }
  }

  // 5) Create one sample appointment (book the first available slot)
  const available = await prisma.availabilitySlot.findFirst({
    where: { doctorId: doctor.id, isBooked: false },
  });

  if (available) {
    // create appointment if not exists at that availability
    const existsApt = await prisma.appointment.findFirst({
      where: {
        availabilityId: available.id,
        patientId: patient1.id,
      },
    });

    if (!existsApt) {
      await prisma.appointment.create({
        data: {
          patientId: patient1.id,
          doctorId: doctor.id,
          availabilityId: available.id,
          date: available.startTime,
          reason: 'General checkup',
          status: 'CONFIRMED', // enum value
        },
      });

      await prisma.availabilitySlot.update({
        where: { id: available.id },
        data: { isBooked: true },
      });
    }
  }

  // 6) Medical records (match your schema: recordType, notes, attachments)
  await prisma.medicalRecord.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: doctor.id,
        recordType: 'consultation',
        notes: 'Patient presented with mild headache. Vitals normal.',
        // attachments column is Json in schema; put null or JSON string
        attachments: null,
      } as any,
      {
        patientId: patient2.id,
        doctorId: doctor.id,
        recordType: 'physical',
        notes: 'Annual physical. No abnormalities detected.',
        attachments: null,
      } as any,
    ],
  });

  // 7) Audit logs (match schema: actorId, action, entityType, payload)
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        action: 'SYSTEM_LOGIN',
        entityType: 'USER',
        entityId: admin.id,
        payload: {
          note: 'Admin seeded and logged in',
        } as Prisma.InputJsonValue,
      },
      {
        actorId: doctor.id,
        action: 'AVAILABILITY_CREATED',
        entityType: 'AVAILABILITY_SLOT',
        payload: { note: 'Availability slots seeded' } as Prisma.InputJsonValue,
      },
      {
        actorId: patient1.id,
        action: 'APPOINTMENT_BOOKED',
        entityType: 'APPOINTMENT',
        payload: { reason: 'General checkup' } as Prisma.InputJsonValue,
      },
    ],
  });

  console.log('✅ Seed complete');
  console.log('Admin: admin@medportal.test / admin123');
  console.log('Doctor: doctor@medportal.test / doctor123');
  console.log('Patient1: patient@medportal.test / patient123');
  console.log('Patient2: patient2@medportal.test / patient123');
  console.log(`Premium subscription ID: ${premium.id}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().then(() => {
      console.log('Prisma disconnected');
    });
  });
