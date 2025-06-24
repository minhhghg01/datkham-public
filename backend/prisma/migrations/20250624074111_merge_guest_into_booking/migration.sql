/*
  Warnings:

  - You are about to drop the column `guestId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Guest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cccd` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ethnicId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupationId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_guestId_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_ethnicId_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_occupationId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "guestId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "cccd" TEXT NOT NULL,
ADD COLUMN     "countryId" INTEGER NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ethnicId" INTEGER NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "occupationId" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;

-- DropTable
DROP TABLE "Guest";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_occupationId_fkey" FOREIGN KEY ("occupationId") REFERENCES "Occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ethnicId_fkey" FOREIGN KEY ("ethnicId") REFERENCES "Ethnic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
