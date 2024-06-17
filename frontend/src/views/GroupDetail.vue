<template>
    <div class="container">
        <GroupDetailHeader :group="group" />
        <div class="root" :style="{ 'margin-top': `${headerHeight}px` }"></div>

        <div class="root">
            <router-link 
                v-for="(expense, index) in groupExpenses" 
                :key="index"
                :to="`/groups/${group.id}/expenses/${expense.id}`" 
                class="group-link">
                <GroupExpenseItem 
                    :title="expense.title" 
                    :amount="expense.amount" 
                    :date="expense.timestamp.split('T')[0]" 
                    :paidby="expense.payedBy" 
                    />
            </router-link>
        </div>

        <PrimaryButton class="floating-button" @click="newExpense">Neue Ausgabe</PrimaryButton>

        <GroupDetailBottom />
        <div class="root" :style="{ 'margin-bottom': `${bottomBarHeight}px` }"></div>
    </div>
</template>

<script>
import GroupDetailHeader from '../components/GroupDetailHeader.vue'
import GroupDetailBottom from '../components/GroupDetailBottom.vue'
import GroupExpenseItem from '../components/GroupExpenseItem.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

export default {
    name: 'GroupDetail',
    components: {
        GroupDetailHeader,
        GroupDetailBottom,
        GroupExpenseItem,
        PrimaryButton,
    },
    data() {
        return {
            showCreateExpenseModal: false,
            headerHeight: 0,
            bottomBarHeight: 0,
            group: {},
            groupExpenses: []
        }
    },
    methods: {
        newExpense() {
            const url = `/groups/${this.$route.params.groupId}/new-expense`;
            this.$router.push(url);
        },
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
        async fetchExpenses() {
            let groupId = this.$route.params.groupId;
            let response = await fetch(`http://localhost:5000/api/groups/${groupId}/expenses`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                this.groupExpenses = data.result;
            } else {
                console.error('Failed to fetch groups:', response.status, response.statusText);
                if (data.message == "Token expired") {
                    const refreshed = await this.refreshjwtToken();
                    if (refreshed) {
                        await this.fetchExpenses();
                    }
                }
            }
        },
        async fetchGroupName() {
            let response = await fetch('http://localhost:5000/api/groups/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                const groups = data.result;
                const groupId = this.$route.params.groupId;
                const group = groups.find(group => group.id == groupId);
                this.group = group;
            } else {
                console.error('Failed to fetch groups:', response.status, response.statusText);
                if (data.message == "Token expired") {
                    const refreshed = await this.refreshjwtToken();
                    if (refreshed) {
                        await this.fetchGroupName();
                    }
                }
            }
        },
    },
    async created() {
        await this.fetchExpenses();
        await this.fetchGroupName();
    },
}
</script>

<style scoped>
.root {
    box-sizing: border-box;
    padding: 2rem;
    flex-grow: 1;
    /* Takes up remaining space */
    overflow-y: auto;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* Full viewport height */
}

.floating-button {
    position: fixed;
    right: 20px;
    bottom: 70px;
}

.group-link {
    text-decoration: none;
    color: inherit;
}

.group-link:visited {
    color: inherit;
}
</style>