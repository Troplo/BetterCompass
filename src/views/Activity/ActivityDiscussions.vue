<template>
  <div>
    <v-dialog v-model="topicDialog" max-width="800px">
      <v-card color="card">
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            <span class="title">Discussion</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="topicDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-card outlined color="card">
            <v-container>
              <v-card-title>
                <v-avatar size="50" class="mr-2">
                  <img :src="selectedTopic.createdByUser.avatarUrl.replace('full', 'square') + '?forceInstance=' + $store.state.school.instance">
                </v-avatar>
                <div>
                  <span class="title">{{ selectedTopic.createdByUser.firstName }} {{ selectedTopic.createdByUser.lastName }}</span>
                </div>
              </v-card-title>
              <v-card-title>{{ selectedTopic.contents[0].name }}</v-card-title>
              <v-card-subtitle>{{selectedTopic.contents[0].body}}</v-card-subtitle>
              <small class="ml-4">{{ $date(selectedTopic.createdAt).fromNow() }}</small>
            </v-container>
          </v-card>
          <v-text-field class="ml-6" label="Add a comment" v-model="newComment" @keyup.enter.native="addComment(selectedTopic)" :counter="250" append-outer-icon="mdi-send" @click:append-outer="addComment(selectedTopic)"></v-text-field>
          <v-divider></v-divider>
          <v-list two-line v-if="selectedTopic.comments" color="card">
            <v-subheader>Comments</v-subheader>
            <v-card v-for="comment in selectedTopic.comments.nodes" :key="comment.id" outlined color="card">
              <v-card-title>
                <v-avatar size="50" class="mr-2">
                  <img :src="selectedTopic.createdByUser.avatarUrl.replace('full', 'square') + '?forceInstance=' + $store.state.school.instance">
                </v-avatar>
                <div>
                  <span class="title">{{ selectedTopic.createdByUser.firstName }} {{ selectedTopic.createdByUser.lastName }}</span>
                </div>
              </v-card-title>
              <p class="ml-6">{{comment.contents[0].body}}</p>
              <small class="ml-6">{{ $date(comment.contents[0].createdAt).fromNow() }}</small>
              <!-- sub replies to comments -->
              <v-divider></v-divider>
              <v-list v-if="comment.replies" class="mx-5" color="card">
                <v-subheader>Replies</v-subheader>
                <v-card v-for="reply in comment.replies.nodes" :key="reply.id" outlined color="card">
                  <v-card-title>
                    <v-avatar size="50" class="mr-2">
                      <img :src="selectedTopic.createdByUser.avatarUrl.replace('full', 'square') + '?forceInstance=' + $store.state.school.instance">
                    </v-avatar>
                    <div>
                      <span class="title">{{ selectedTopic.createdByUser.firstName }} {{ selectedTopic.createdByUser.lastName }}</span>
                    </div>
                  </v-card-title>
                  <p class="ml-6">{{reply.contents[0].body}}</p>
                </v-card>
              </v-list>
            </v-card>
          </v-list>
        </v-container>
      </v-card>
    </v-dialog>
    <v-container>
      <v-alert type="info" text>
        This is coming soon!
      </v-alert>
      <v-card color="card" class="rounded-xl">
        <v-toolbar color="toolbar">
          <v-toolbar-title>
            Discussions
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text>
            Create
          </v-btn>
        </v-toolbar>
        <v-container>
          <v-card v-for="topic in userData.topics" :key="topic.id" outlined hover @click="openTopic(topic)" color="card">
            <v-container>
              <v-card-title>{{ topic.contents[0].name }}</v-card-title>
              <v-card-subtitle>
                {{ topic.createdByUser.firstName }} {{topic.createdByUser.lastName}}<br>
                {{ topic.comments.totalCount}} comments &bullet; {{ $date(topic.createdAt).fromNow() }}
              </v-card-subtitle>
            </v-container>
          </v-card>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import AjaxErrorHandler from "@/lib/errorHandler";
export default {
  name: "ActivityDiscussions",
  props: ["activity"],
  data() {
    return {
      topics: [],
      userData: {},
      topicDialog: false,
      newComment: "",
      selectedTopic: {
        contents: [{
          name: "Placeholder"
        }],
        createdByUser: {
          avatarUrl: ""
        }
      },
      create: {
        topicBody: "This is a test.",
        topicName: "Hello.",
      }
    }
  },
  methods: {
    addComment(topic) {
      this.$toast.error("Not implemented yet.")
      console.log(topic)
    },
    openTopic(topic) {
      this.$apollo.mutate({
        mutation: gql`
        query GetCommentSetForTopic($topicId: Uuid!, $amount: PaginationAmount!, $cursor: String, $replyAmount: PaginationAmount!, $replyCursor: String, $sortDirection: SortOperationKind!) {
  currentUser {
    id
    topics(order_by: {createdAt: DESC}, where: {id: $topicId}) {
      id
      comments(order_by: {createdAt: $sortDirection}, where: {archivedAt: null, parentCommentId: null}, first: $amount, after: $cursor) {
        nodes {
          ...CommentFields
          replies(order_by: {createdAt: ASC}, where: {archivedAt: null}, first: $replyAmount, after: $replyCursor) {
            nodes {
              ...CommentFields
              __typename
            }
            totalCount
            pageInfo {
              hasNextPage
              endCursor
              __typename
            }
            __typename
          }
          __typename
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment CommentFields on DiscussionsComment {
  id
  canEdit
  canDelete
  createdByUser {
    userId
    id
    firstName
    lastName
    avatarUrl
    __typename
  }
  parentCommentId
  topicId
  contents(order_by: {createdAt: DESC}) {
    body
    id
    commentId
    createdAt
    createdByUserId
    __typename
  }
  topic {
    id
    createdByUser {
      id
      userId
      __typename
    }
    __typename
  }
  __typename
}`,
        variables: {
          amount: 25,
          replyAmount: 25,
          sortDirection: "DESC",
          topicId: topic.id,
        }
      }).then((res) => {
        this.selectedTopic = topic;
        this.selectedTopic.comments = res.data.currentUser.topics[0].comments;
        this.topicDialog = true;
      })
    },
    async createTopic() {
      await this.$apollo.mutate({
        mutation: gql`mutation CreateTopic($associationId: Int!, $schoolId: String, $topicBody: String!, $topicName: String!, $type: AssociationType!,$userId:Int!) {
  createTopic(associationId: $associationId, schoolId: $schoolId, topicBody: $topicBody, topicName: $topicName, type: $type, userId: $userId) {
    id
  }
}`,
        variables: {
          schoolId: this.$store.state.school.id,
          topicBody: this.create.topicBody,
          topicName: this.create.topicName,
          type: "ACTIVITY",
          userId: this.$store.state.user.userId,
          associationId: JSON.parse(this.activity.ActivityId)
        },
      }).then(() => {
        this.getTopics()
      }).catch((e) => {
        AjaxErrorHandler(this.$store)(e)
      })
    },
    deleteTopic() {

    },
    async getTopics() {
      await this.$apollo.mutate({
        operationName: "SummaryForAssociation",
        mutation: gql`query SummaryForAssociation($schoolId: String!, $associationType: AssociationType!, $associationId: Int!) {
  currentUser {
    username
    baseRole
    reportName
    firstName
    lastName
    profileImage(size: FULL) {
      url
      id
      __typename
    }
    id
    topics(order_by: {createdAt: DESC}, where: {associationType: $associationType, associationId: $associationId, schoolId: $schoolId, archivedAt: null}) {
      id
      canEdit
      canDelete
      archivedAt
      associationId
      archivedByUserId
      createdAt
      createdByUser {
        userId
        firstName
        lastName
        avatarUrl
        id
        __typename
      }
      createdByUserId
      lastUpdatedAt
      lockedTimeStamp
      schoolId
      updatedByUserId
      comments(order_by: {createdAt: DESC}, where: {archivedAt: null, parentCommentId: null}) {
        totalCount
        nodes {
          id
          __typename
        }
        __typename
      }
      contents(order_by: {createdAt: DESC}) {
        body
        name
        id
        __typename
      }
      updatedByUserId
      __typename
    }
    __typename
  }
}`,
        variables: {
          schoolId: this.$store.state.school.id,
          associationType: "ACTIVITY",
          associationId: JSON.parse(this.activity.ActivityId)
        },
      }).then((res) => {
        this.userData = res.data.currentUser
      }).catch((e) => {
        console.error(e)
      })
    },
  },
  mounted() {
    this.getTopics()
  }
}
</script>

<style scoped>

</style>