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

@Table({ tableName: 'inventories' })
export class Inventory extends Model<Inventory> {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number

    @Column({allowNull: true, defaultValue: ""})
    name: string

    @Column
    start_time: string

    @Column
    end_time: string

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
            start_time: this.start_time,
            end_time: this.end_time,
            seats: this.seats,
            restaurant_id: this.restaurant_id,
        }
    }
}
