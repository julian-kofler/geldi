<template>
    <div class="root">
        <h1>Guppen</h1>
        <GroupsListItem v-for="group in groups" :key="group.id" :group="group" />
    </div>
    <NavigationBar />
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
import GroupsListItem from '../components/GroupsListItem.vue'

export default {
    name: 'GuppenScreen',
    components: {
        NavigationBar,
        GroupsListItem
    },
    data() {
        return {
            groups: [
                { id: 1, name: 'Gutenberg WG' },
                { id: 2, name: 'Pizza Abend' },
                { id: 3, name: 'Sommerurlaub' },
                { id: 4, name: 'Kino' },
                { id: 5, name: 'Geburtstag' },
                { id: 6, name: 'Weihnachtsfeier' },
                { id: 7, name: 'Sport' },
                { id: 8, name: 'Kochen' },
                { id: 9, name: 'Garten' },
                { id: 10, name: 'Buchclub' },
                { id: 11, name: 'Gaming' },
                { id: 12, name: 'Musik' },
                { id: 13, name: 'Fotografie' },
                { id: 14, name: 'Kunst' },
                { id: 15, name: 'Reisen' },
                { id: 16, name: 'Wandern' },
                { id: 17, name: 'Radfahren' },
                { id: 18, name: 'Schwimmen' },
                { id: 19, name: 'Tanzen' },
                { id: 20, name: 'Klettern' },
                { id: 21, name: 'Yoga' },
                { id: 22, name: 'Pilates' },
                { id: 23, name: 'Fitness' },
                { id: 24, name: 'Joggen' },
                { id: 25, name: 'Laufen' },
                { id: 26, name: 'Marathon' },
                { id: 27, name: 'Triathlon' },
                { id: 28, name: 'Schach' },
                { id: 29, name: 'Poker' },
                { id: 30, name: 'Brettspiele' },
                { id: 31, name: 'Kartenspiele' },
                { id: 32, name: 'Billard' },
                { id: 33, name: 'Bowling' },
                { id: 34, name: 'Darts' },
                { id: 35, name: 'Tischtennis' },
                { id: 36, name: 'Fußball' },
                { id: 37, name: 'Handball' },
                { id: 38, name: 'Basketball' },
                { id: 39, name: 'Volleyball' },
                { id: 40, name: 'Tennis' },
                { id: 41, name: 'Badminton' },
                { id: 42, name: 'Golf' },
                { id: 43, name: 'Rugby' },
                { id: 44, name: 'American Football' },
            ]
        }
    }
};
</script>

<style scoped>
.root {
    padding: 2rem;
}
</style>