import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import Logger from '../logger'
import {Inventory, Reservation} from '../models'

@Controller('slots')
export class SlotsController {
  @Get('')
  private async get(req: Request, res: Response) {
    const { restaurant_id } = req.query
    const options = !!restaurant_id ? { restaurant_id } : {}

    try {
      const inventory = await Inventory.findAll({
        where: { deleted_at: null, ...options }
      })
      const reservations = await Reservation.findAll({
        where: { deleted_at: null, ...options}
      })
      const slots = inventory
        .reduce((results, inv) => {
          const { id, seats, start_time, end_time, restaurant_id } = inv
          let [startHour, startMinute ] = start_time.split(":")
          startHour = +startHour
          startMinute = +startMinute
          let [endHour, endMinute ] = end_time.split(":")
          endHour = +endHour
          endMinute = +endMinute
          if (startHour > endHour) {
            throw Error("invalid start time")
          }
          while (startHour <= endHour && startMinute <= endMinute) {
            const hour = `${startHour}`.padStart(2, "0")
            const minute = `${startMinute}`.padStart(2, "0")
            const time = `${hour}:${minute}`
            results[time] = {
              time,
              seats,
              inventory_id: id,
              restaurant_id,
            }
            if (startMinute % 45 === 0) {
              if (startHour % 23 === 0) {
                startHour = 0
              }
              startHour += 1
              startMinute = 0
            } else {
              startMinute += 15
            }
          }
          return results
        }, {})
      reservations.forEach((reservation) => {
        const { seats, time } = reservation.dataValues
        const slot = slots[time]
        slot.seats -= seats
      })

      return res.json(Object.values(slots))
    } catch (error) {
      Logger.error(`failed to get inventory ${error}`)
      return res.sendStatus(500)
    }
  }
}