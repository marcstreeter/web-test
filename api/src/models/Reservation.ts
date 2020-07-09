import {
    Column,
    CreatedAt,
    DeletedAt,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt,
    ForeignKey
} from 'sequelize-typescript'

import { Restaurant } from '../models'

@Table({ tableName: 'reservations' })
export class Reservation extends Model<Reservation> {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number

    @Column
    name: string

    @Column
    time: string

    @Column
    seats: number

    @ForeignKey(() => Restaurant)
    @Column({ onDelete: "CASCADE" })
    restaurant_id: number

    @DeletedAt
    deleted_at: string

    @CreatedAt
    created_at: string

    @UpdatedAt
    updated_at: string

    toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            time: this.time,
            seats: this.seats,
            restaurant_id: this.restaurant_id,
        }
    }
}
