<template>
  <div id="profileTasks">
    <b-table
        :data="tasks"
        :bordered="true"
        :striped="true"
        :narrowed="true"
        :hoverable="true"
        :loading="false"
        :focusable="true"
        :mobile-cards="false">

      <b-table-column field="id" label="Activity" width="40" :td-attrs="columnTdAttrs" numeric v-slot="props">
        {{ props.row.activityName }}
      </b-table-column>

      <b-table-column field="name" label="Name" :td-attrs="columnTdAttrs" v-slot="props">
        <b-tooltip v-if="props.important" type="is-danger" label="This task is marked as important!"><b-tag v-if="props.important" type="is-danger" rounded><i v-if="props.important" class="fas fa-exclamation-circle orwell-icon"></i></b-tag></b-tooltip>
        {{ props.row.name }}
      </b-table-column>

      <b-table-column field="due" label="Created" :td-attrs="columnTdAttrs" v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.createdTimestamp).toLocaleDateString() }}
                </span>
      </b-table-column>

      <b-table-column field="date" label="Due" :th-attrs="dateThAttrs" :td-attrs="columnTdAttrs" centered v-slot="props">
                <span class="tag is-success">
                    {{ new Date(props.row.dueDateTimestamp).toLocaleDateString() }}, {{ new Date(props.row.dueDateTimestamp).toLocaleTimeString() }}
                </span>
      </b-table-column>

      <b-table-column label="Submitted" :td-attrs="columnTdAttrs">
        ?
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No records</div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "ProfileTasks",
  data() {
    return {
      tasks: []
    }
  },
  mounted() {
        this.axios
            .post('/Services/LearningTasks.svc/GetAllLearningTasksByUserId?sessionstate=readonly&_dc=1622189446331\n', {
              userId: this.$store.state.user.id,
              forceTaskId: 0,
              limit: 500,
              page: 1,
              showHiddenTasks: false,
              sort: "[{\"property\":\"dueDateTimestamp\",\"direction\":\"DESC\"}]",
              start: 0
            })
            .then((res) =>
                this.tasks = res.data.d.data
            )
  }
}
</script>

<style scoped>

</style>