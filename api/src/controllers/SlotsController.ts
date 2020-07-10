import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
import Logger from '../logger'
import { Slot } from '../models/Slot'

@Controller('slots')
export class SlotsController {
  @Get('')
  private async get(req: Request, res: Response) {
    const { restaurant_id } = req.query
    const options = !!restaurant_id ? { restaurant_id } : {}
    try {
      const slots = await Slot.filtered(options)
      return res.json(slots)
    } catch (error) {
      Logger.error(`failed to get slots ${error}`)
      return res.sendStatus(500)
    }
  }
}