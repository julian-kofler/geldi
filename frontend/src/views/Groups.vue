<template>
    <div class="root">
        <h1 class="title">Gruppen</h1>
        <router-link v-for="group in groups" :key="group.id" :to="`/groups/${group.id}`" tag="div" class="group-link">
            <GroupsListItem :group="group" />
        </router-link>
        <PrimaryButton class="floating-button" @click="handleClick">
            Neue Gruppe
        </PrimaryButton>
    </div>
    <NavigationBar />
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
import GroupsListItem from '../components/GroupsListItem.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
export default {
    name: 'GuppenScreen',
    components: {
        NavigationBar,
        GroupsListItem,
        PrimaryButton
    },
    data() {
        return {
            groups: []
        }
    },
    methods: {
        async refreshjwtToken() {
            const response = await fetch('http://localhost:5000/api/auth/refreshJWT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwt', data.jwt);
                return true;
            } else {
                console.error('Failed to refresh token:', response.status, response.statusText);
                return false;
            }
        },
        async fetchGroups() {
            let response = await fetch('http://localhost:5000/api/groups/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                this.groups = data.result;
            } else {
                console.error('Failed to fetch groups:', response.status, response.statusText);
                if (data.message == "Token expired") {
                    const refreshed = await this.refreshjwtToken();
                    if (refreshed) {
                        await this.fetchGroups(); 
                    }
                }
            }
        },
    },
    async created() {
        await this.fetchGroups();
    }
};
</script>

<style scoped>
.root {
    padding: 2rem;
}

.title {
    color: var(--color5);
    text-align: center;
    font-size: 2em;
}

.group-link {
    text-decoration: none;
    color: inherit;
}

.group-link:visited {
    color: inherit;
}

.floating-button {
    position: fixed;
    right: 20px;
    bottom: 70px;
}
</style>