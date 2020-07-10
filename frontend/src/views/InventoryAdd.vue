<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">New Inventory</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Name">
          <b-input
            type="name"
            v-model=name
            placeholder="Inventory Name"
            required>
          </b-input>
        </b-field>
        <b-field label="Start Time">
          <b-select placeholder="Select starting time" v-model="timeStart">
            <option
              v-for="option in slots"
              :value="option.time"
              :key="option.time">
              {{ option.time }}
            </option>
          </b-select>
        </b-field>
        <b-field label="End Time">
          <b-select placeholder="Select ending time" v-model="timeEnd">
            <option
              v-for="option in slots"
              :value="option.time"
              :key="option.time"
              :disabled="!!!timeStart || option.time < timeStart">
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
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  @Component
  export default class ReservationsAdd extends Vue {
    @Prop({ required: true }) private saveHandler: (name: string, timeStart: string, timeEnd: string, seats: number) => void
    @Prop({ required: true }) private closeHandler: () => void
    public name = ''
    private loading = false
    private time = ''
    private seats = 1
    private slots = []
    private timeStart = null
    private timeEnd = null
    public onSave(evt: Event){
      evt.preventDefault()
      evt.stopPropagation()
      this.saveHandler(this.name, this.timeStart, this.timeEnd, this.seats)
    }
    @Watch('timeStart')
    timeStartChanged() {
      this.timeEnd = null
    }
    async mounted() {
      try {
        this.loading = true
        const response = await axios.get('http://localhost:9090/slots?restaurant_id=1')
        this.slots = response.data
          .filter(slot => slot.inventory_id === null)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
</script>