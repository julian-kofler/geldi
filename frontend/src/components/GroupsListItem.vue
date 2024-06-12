<template>
    <div class="group-list-item">
        <div class="icon-container">
            <img v-if="group.profilePic" :src="group.profilePic" alt="Profile Picture" class="profile-pic">
            <font-awesome-icon v-else icon="fa-solid fa-users" />
        </div>

        <div class="group-name">{{ group.name }}</div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default {
    components: {
        FontAwesomeIcon
    },
    props: {
        group: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            faUser
        }
    }
}
</script>

<style scoped>
.group-list-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.group-list-item:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.fa-icon, .profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.fa-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ccc;
    color: white;
    font-size: 24px;
}

.group-name {
    font-size: 1.2em;
    font-weight: 500;
}
</style>