import prisma from "../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

export const createReservation = async ({ tableId, reservationDate, guestCount, customerId }) => {
    if(!tableId || !reservationDate || !guestCount){
        throw new BadRequestError("Missing Information");
    }

    if(new Date(reservationDate) < new Date()){
        throw new BadRequestError("Date must be at least today or later");
    }

    if(guestCount < 1){
        throw new BadRequestError("Guests must be atleast One");
    }

    const customer = await prisma.user.findUnique({
        where: {
            id: customerId
        }
    })

    if(!customer){
        throw new NotFoundError("Customer not found");
    }

    const tableExists = await prisma.table.findUnique({
        where: {
            id: tableId
        },
        select:{
            tableNumber: true
        }
    })

    if(!tableExists){
        throw new NotFoundError("Table not found");
    }

    const newReservation = await prisma.reservation.create({
        data: {
            customerId,
            tableId,
            reservationDate,
            guestCount,
        }
    })

    return newReservation;
}

export const fetchCustomerReservations = async(customerId) => {

    const customerExists = await prisma.user.findUnique({
        where: {
            id: customerId
        }
    })

    if(!customerExists){
        throw new NotFoundError("Customer not found");
    }

    const reservations = await prisma.reservation.findMany({
        where: {
            customerId: customerId
        }
    })

    return reservations;
}

export const fetchAllReservations = async () => {
  const reservations = await prisma.reservation.findMany({
    include: {
      customer: true,
      table: true
    }
  });
  return reservations;
}
export const updateReservationStatus = async ({id, status}) => {
    const validStatuses = ["PENDING", "APPROVED", "REJECTED","CANCELLED"];

    if(!validStatuses.includes(status)) {
        throw new BadRequestError("Invalid Status Provided");
    }

    const reservationExists =  await prisma.reservation.findUnique({
        where: {
            id: id
        }
    })

    if(!reservationExists){
        throw new NotFoundError("Reservation not found");
    }

    const updateReservation = await prisma.reservation.update({
        where: {id},
        data: {status}
    })

    return updateReservation;
}
