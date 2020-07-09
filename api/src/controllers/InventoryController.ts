import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import Logger from '../logger'
import { Inventory } from '../models'

@Controller('inventory')
export class InventoryController {
    @Get('')
    private async get(req: Request, res: Response) {
        const { restaurant_id } = req.query
        const options = !!restaurant_id ? { restaurant_id } : {}

        try {
            const inventory = await Inventory.findAll({
                where: { deleted_at: null, ...options }
            })
            return res.json(inventory.map( row => row.toJSON()))
        } catch (error) {
            Logger.error(`failed to get inventory ${error}`)
            return res.sendStatus(500)
        }
    }
    @Post('')
    private async post(req: Request, res: Response) {
        const {
            name,
            start_time,
            end_time,
            seats,
            restaurant_id,
        } = req.body
        try {
            const inventory = await Inventory
              .create({
                  name,
                  start_time,
                  end_time,
                  seats,
                  restaurant_id
              })
            return res.json(inventory.toJSON())
        } catch (error) {
            Logger.error(`failed to create inventory ${error}`)
            return res.status(500).json({ error })
        }
    }
}