<template>
    <form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">New Reservation</p>
            </header>
            <section class="modal-card-body">
                <b-field label="Name">
                    <b-input
                      type="name"
                      v-model=name
                      placeholder="Reservation Name"
                      required>
                    </b-input>
                </b-field>
                <b-field label="Time">
                    <b-select placeholder="Select a time" v-model="time">
                        <option
                          v-for="option in slots"
                          :value="option.time"
                          :key="option.time"
                          :disabled="!!!option.seats">
                            {{ option.time }}
                        </option>
                    </b-select>
                </b-field>
                <b-field label="Seats">
                    <b-input
                      type="number"
                      v-model="seats"
                      placeholder="Reservation Size"
                      required>
                    </b-input>
                </b-field>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="closeHandler">Close</button>
                <button class="button is-primary" @click="onSave($event)">Save</button>
            </footer>
        </div>
    </form>
</template>
<script lang="ts">
    import axios from 'axios'
    import { Component, Prop, Vue } from 'vue-property-decorator'
    @Component
    export default class ReservationsAdd extends Vue {
        @Prop({ required: true }) private saveHandler: (name: string, time: string, seats: number) => void
        @Prop({ required: true }) private closeHandler: () => void
        public name = ''
        private loading = false
        private time = ''
        private seats = 1
        private slots = []
        public onSave(evt: Event){
            evt.preventDefault()
            evt.stopPropagation()
            this.saveHandler(this.name, this.time, this.seats)
        }
        async mounted() {
            try {
                this.loading = true
                const response = await axios
                  .get('http://localhost:9090/slots?restaurant_id=1')
                this.slots = response.data.filter(slot => slot.inventory_id !== null)
            } catch (error) {
                console.error(error)
            } finally {
                this.loading = false
            }
        }


    }
</script>