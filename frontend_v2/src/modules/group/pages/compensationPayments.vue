<script setup lang="ts">
import TopBar from "@/components/headerBar.vue";
import { useRoute, useRouter } from "vue-router";
import { getBackend, getMyUserID } from "@/components/backendHandler";
import type {CompensationPayment, GroupResponse} from "@/components/types"
import {onMounted, ref} from "vue"

const route = useRoute();
const router = useRouter();

const compensation_payments = ref<CompensationPayment[]>();

const fetchPayments = async () => {
  const res = await getBackend(`/expenses/compensation-payments?groupId=${route.params.groupID}`);
  compensation_payments.value=res.result;
};

const groupInfo = ref<GroupResponse>();
const fetchGroupInfo = async () => {
  const res = await getBackend(`/groups/group?groupId=${route.params.groupID}`);
  groupInfo.value = res.result;
};
const nickname = (userID: number):string => {
  if (userID == getMyUserID()){
    return 'dir';
  }
  return groupInfo.value?.members.find((member) => member.userId == userID)?.nickname || "Loading..."
}

onMounted(()=>{
  fetchPayments();
  fetchGroupInfo();
});
</script>

<template>
  <TopBar :back_route="`/groups/${route.params.groupID}`"
    >Ausgleichszahlungen
  </TopBar>
  <div class="content-container with-top-bar">
    <div v-for="payment in compensation_payments" class="card">
      <div>von: {{ nickname(payment.by) }}</div>
      <div>an: {{ nickname(payment.to) }}</div>
      <div>Kosten: {{ payment.amount }} €</div>
    </div>
    <div v-for="payment in compensation_payments">

    </div>
  </div>
</template>
<style scoped>
.card{
  flex-direction: row;
}
</style>