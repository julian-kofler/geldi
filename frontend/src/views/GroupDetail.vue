<template>
    <div class="container">
        <GroupDetailHeader :group="group" />
        <div class="root" :style="{ 'margin-top': `${headerHeight}px` }"></div>
        <div class="root">
            <router-link v-for="(expense, index) in groupExpenses" :key="index"
                :to="`/groups/${group.id}/expenses/${expense.expenseId}`" class="group-link">
                <GroupExpenseItem :title="expense.title" :amount="expense.amount" :date="expense.date"
                    :paidby="expense.paidby" />
            </router-link>
        </div>
        <PrimaryButton class="floating-button" @click="handleClick">Neue Ausgabe</PrimaryButton>
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
        PrimaryButton
    },
    data() {
        return {
            headerHeight: 0,
            bottomBarHeight: 0,
            group: { id: 1, name: 'Gutenberg WG' },
            groupExpenses: [
                { expenseId: 1, title: 'Expense 1', amount: '10,50', date: '01.01.2022', paidby: 'User 1' },
                { expenseId: 2, title: 'Expense 2', amount: '20,75', date: '02.02.2022', paidby: 'User 2' },
                { expenseId: 3, title: 'Expense 3', amount: '30,00', date: '03.03.2022', paidby: 'User 3' },
                { expenseId: 4, title: 'Expense 4', amount: '40,25', date: '04.04.2022', paidby: 'User 4' },
                { expenseId: 5, title: 'Expense 1', amount: '10,50', date: '01.01.2022', paidby: 'User 1' },
                { expenseId: 6, title: 'Expense 2', amount: '20,75', date: '02.02.2022', paidby: 'User 2' },
                { expenseId: 7, title: 'Expense 3', amount: '30,00', date: '03.03.2022', paidby: 'User 3' },
                { expenseId: 8, title: 'Expense 4', amount: '40,25', date: '04.04.2022', paidby: 'User 4' },
                { expenseId: 9, title: 'Expense 1', amount: '10,50', date: '01.01.2022', paidby: 'User 1' },
                { expenseId: 10, title: 'Expense 2', amount: '20,75', date: '02.02.2022', paidby: 'User 2' },
                { expenseId: 11, title: 'Expense 3', amount: '30,00', date: '03.03.2022', paidby: 'User 3' },
                { expenseId: 12, title: 'Expense 4', amount: '40,25', date: '04.04.2022', paidby: 'User 4' },
                { expenseId: 13, title: 'Expense 1', amount: '10,50', date: '01.01.2022', paidby: 'User 1' },
                { expenseId: 14, title: 'Expense 2', amount: '20,75', date: '02.02.2022', paidby: 'User 2' },
                { expenseId: 15, title: 'Expense 3', amount: '30,00', date: '03.03.2022', paidby: 'User 3' },
                { expenseId: 16, title: 'Expense 4', amount: '40,25', date: '04.04.2022', paidby: 'User 4' },
                { expenseId: 17, title: 'Expense 1', amount: '10,50', date: '01.01.2022', paidby: 'User 1' },
                { expenseId: 18, title: 'Expense 2', amount: '20,75', date: '02.02.2022', paidby: 'User 2' },
                { expenseId: 19, title: 'Expense 3', amount: '30,00', date: '03.03.2022', paidby: 'User 3' },
                { expenseId: 20, title: 'Expense 4', amount: '40,25', date: '04.04.2022', paidby: 'User 4' },
                { expenseId: 21, title: 'Expense 1', amount: '10,50', date: '01.01.2022', paidby: 'User 1' },
                { expenseId: 22, title: 'Expense 2', amount: '20,75', date: '02.02.2022', paidby: 'User 2' },
                { expenseId: 23, title: 'Expense 3', amount: '30,00', date: '03.03.2022', paidby: 'User 3' },
                { expenseId: 24, title: 'Expense 4', amount: '40,25', date: '04.04.2022', paidby: 'User 4' },
            ]
        }
    },
    mounted() {
        this.headerHeight = this.$refs.header.$el.offsetHeight;
        this.bottomBarHeight = this.$refs.bottom.$el.offsetHeight;
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