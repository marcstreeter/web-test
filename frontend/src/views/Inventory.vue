<template>
  <div>
    <h1>Inventory</h1>
    <b-field grouped group-multiline>
      <button class="button field is-success" @click="onAddModalOpen">
        <span>Add</span>
      </button>
      <button
        class="button field is-danger"
        @click="selected"
        :disabled="!selected.length">
        <span>Remove</span>
      </button>
    </b-field>
    <b-table
      :data="items"
      :columns="columns"
      checkable
      :checkbox-position="checkboxPosition"
      :checked-rows.sync="selected"
      hoverable />
    <b-modal :active.sync="addModalActive"
             has-modal-card
             trap-focus
             aria-role="dialog"
             aria-modal>
      <inventory-add :save-handler="AddModalSave" :close-handler="onAddModalClose" />
    </b-modal>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'
  import InventoryAdd from "@/views/InventoryAdd.vue";

  @Component({ components: { InventoryAdd } })
  export default class Inventory extends Vue {
    private addModalActive = false
    private items = []
    private selected = []
    private checkboxPosition = 'left'
    private columns = [
      {
        field: 'name',
        label: 'Name',
      }, {
        field: 'start_time',
        label: 'Starts',
        width: '40',
      }, {
        field: 'end_time',
        label: 'Ends',
        width: '40',
      }, {
        field: 'seats',
        label: 'Seats',
        width: '5',
        numeric: true
      }
    ]

    public onAddModalOpen(): void {
      this.addModalActive = true
    }

    public onAddModalClose(): void {
      console.log("Closing")
      this.addModalActive = false
    }

    public async AddModalSave(name: string, startTime: string, endTime: string, seats: number) {
      //this.onAddModalSaving()
      try {
        const response = await axios.post(
          'http://localhost:9090/inventory',
          {name, 'start_time': startTime, 'end_time': endTime, seats, 'restaurant_id': 1 })
        if (response.status !== 200) {
          throw Error(`failed to create inventory: ${response.data.error}`)
        }
        this.items.unshift(response.data)
        this.onAddModalClose()
      } catch (error) {
        console.error(error)
      }
    }

    async created() {
      try {
        const response = await axios.get('http://localhost:9090/inventory?restaurant_id=1')
        this.items = response.data
      } catch (error) {
        console.error(error)
      }
    }
  }
</script>
