<template>
  <div>
    <h1>Inventory</h1>
    <b-field grouped group-multiline>
      <button class="button field is-success" @click="selected">
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
      :data="inventory"
      :columns="columns"
      checkable
      :checkbox-position="checkboxPosition"
      :checked-rows.sync="selected"
      hoverable />
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class Inventory extends Vue {
    private inventory = []
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

    async created() {
      try {
        const response = await axios.get('http://localhost:9090/inventory?restaurant_id=1')
        this.inventory = response.data
      } catch (error) {
        console.error(error)
      }
    }
  }
</script>
