import { Inventory, Reservation } from '../models'

const slots = Array.from({ length: (24 * 4)}, (_, i) => {
  const hour = Math.floor(i/4)
  const minute = (i % 4) * 15
  const hh = `${hour}`.padStart(2, '0')
  const mm = `${minute}`.padStart(2, '0')
  return `${hh}:${mm}`
})

export class Slot {
  public static async filtered(options: any = {}) {
    // validate options: id, name, start_time, end_time, seats, restaurant_id
    const { restaurant_id: restaurantId = null } = options
    const inventory = await Inventory.filtered(options)
    const reservations = await Reservation.findAll({
      where: {deleted_at: null, ...options}
    })
    const taken = inventory
      .reduce((results, inv) => {
        const {id, seats, start_time, end_time, restaurant_id} = inv
        let [startHour, startMinute] = start_time.split(":")
        startHour = +startHour
        startMinute = +startMinute
        let [endHour, endMinute] = end_time.split(":")
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
          if (startMinute !== 0 && startMinute % 45 === 0) { // increasing hour
            if (startHour % 23 === 0) {  // looping hour
              startHour = 0
            } else {
              startHour += 1
              startMinute = 0
            }
          } else { // increasing minute
            startMinute += 15
          }
        }
        return results
      }, {})
    reservations.forEach((reservation) => {
      const { seats, time } = reservation.dataValues
      const slot = taken[time]
      slot.seats -= seats
    })
    const emptySlot = { seats: 0, inventory_id: null, restaurant_id: restaurantId }
    return slots.map(time => taken[time] || {time, ...emptySlot})
  }
}
