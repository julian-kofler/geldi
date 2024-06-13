<template>
    <div class="group-detail-header">
        <div class="icon-container">
            <font-awesome-icon icon="chevron-left" class="back-arrow" @click="back" />
        </div>
        <!-- <router-link :to="`${$route.path}/manage`" class="group-link"> -->
        <GroupsListItem :group="group" @click="nameClicked"/>
        <!-- </router-link> -->
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import GroupsListItem from './GroupsListItem.vue'
import {useRouter} from 'vue-router'

export default {
    name: 'GroupDetailHeader',
    components: {
        FontAwesomeIcon,
        GroupsListItem
    },
    props: {
        group: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            faChevronLeft
        }
    },
    methods: {
        back() {
            this.$router.push('/groups');
        },
        nameClicked() {
            this.$router.push(`/groups/${this.$route.params.groupId}/manage`);
        }
    }
}
</script>

<style scoped>
.group-detail-header {
  display: flex;
  justify-content: center; /* Center the items */
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  background-color: whitesmoke;
  padding: 10px 0;
  box-sizing: border-box;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.back-arrow {
  font-size: 24px;
  margin-left: 20px; /* Add some space to the left of the back arrow */
  cursor: pointer;
  position: absolute; /* Position the back arrow absolutely */
  left: 0; /* Align the back arrow to the left */
}

.group-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}
.group-link {
    text-decoration: none;
    color: inherit;
}
.group-link:visited {
    color: inherit;
}
</style>