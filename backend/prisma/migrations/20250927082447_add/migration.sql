-- CreateEnum
CREATE TYPE "public"."MuscleGroup" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'LEGS', 'CORE', 'FULL_BODY');

-- CreateEnum
CREATE TYPE "public"."ExerciseType" AS ENUM ('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE');

-- CreateEnum
CREATE TYPE "public"."ExerciseEquipment" AS ENUM ('NONE', 'DUMBBELLS', 'BARBELL', 'MACHINE', 'RESISTANCE_BANDS', 'BODYWEIGHT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ExerciseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "public"."MetricType" AS ENUM ('TIME', 'DISTANCE', 'REPS', 'SETS', 'CALORIES');

-- CreateEnum
CREATE TYPE "public"."SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "bio" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workouts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shareToken" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."exercise_definitions" (
    "id" SERIAL NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "description" TEXT,
    "primaryTarget" "public"."MuscleGroup" NOT NULL,
    "exerciseType" "public"."ExerciseType" NOT NULL DEFAULT 'STRENGTH',
    "equipment" "public"."ExerciseEquipment" NOT NULL DEFAULT 'NONE',
    "level" "public"."ExerciseLevel" NOT NULL DEFAULT 'BEGINNER',
    "instructions" TEXT,
    "isSystemDefined" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,

    CONSTRAINT "exercise_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workout_exercises" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metricType" "public"."MetricType" NOT NULL,
    "metricValue" DOUBLE PRECISION NOT NULL,
    "metricUnit" TEXT,
    "WorkoutId" INTEGER NOT NULL,
    "exerciseDefinitionId" INTEGER NOT NULL,

    CONSTRAINT "Workout_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workout_saved" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "WorkoutId" INTEGER NOT NULL,

    CONSTRAINT "Workout_saved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workout_sessions" (
    "id" SERIAL NOT NULL,
    "status" "public"."SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "WorkoutId" INTEGER NOT NULL,

    CONSTRAINT "workout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workout_session_exercises" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "actualMetricValue" DOUBLE PRECISION,
    "actualMetricUnit" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "WorkoutExerciseId" INTEGER NOT NULL,

    CONSTRAINT "workout_session_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "WorkoutId" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "WorkoutId" INTEGER NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_saved_userId_WorkoutId_key" ON "public"."Workout_saved"("userId", "WorkoutId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_WorkoutId_key" ON "public"."likes"("userId", "WorkoutId");

-- AddForeignKey
ALTER TABLE "public"."Workouts" ADD CONSTRAINT "Workouts_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."exercise_definitions" ADD CONSTRAINT "exercise_definitions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout_exercises" ADD CONSTRAINT "Workout_exercises_WorkoutId_fkey" FOREIGN KEY ("WorkoutId") REFERENCES "public"."Workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout_exercises" ADD CONSTRAINT "Workout_exercises_exerciseDefinitionId_fkey" FOREIGN KEY ("exerciseDefinitionId") REFERENCES "public"."exercise_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout_saved" ADD CONSTRAINT "Workout_saved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Workout_saved" ADD CONSTRAINT "Workout_saved_WorkoutId_fkey" FOREIGN KEY ("WorkoutId") REFERENCES "public"."Workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_sessions" ADD CONSTRAINT "workout_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_sessions" ADD CONSTRAINT "workout_sessions_WorkoutId_fkey" FOREIGN KEY ("WorkoutId") REFERENCES "public"."Workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."workout_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workout_session_exercises" ADD CONSTRAINT "workout_session_exercises_WorkoutExerciseId_fkey" FOREIGN KEY ("WorkoutExerciseId") REFERENCES "public"."Workout_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_WorkoutId_fkey" FOREIGN KEY ("WorkoutId") REFERENCES "public"."Workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_WorkoutId_fkey" FOREIGN KEY ("WorkoutId") REFERENCES "public"."Workouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
