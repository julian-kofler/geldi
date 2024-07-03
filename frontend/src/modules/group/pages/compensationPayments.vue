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
  try {
    const res = await getBackend(`/expenses/compensation-payments?groupId=${route.params.groupID}`);
    compensation_payments.value=res.result;
  } catch (error) {
    alert("Laden der Ausgleichszahlungen fehlgeschlagen!");
  }
};

const groupInfo = ref<GroupResponse>();
const fetchGroupInfo = async () => {
  try {
    const res = await getBackend(`/groups/group?groupId=${route.params.groupID}`);
    groupInfo.value = res.result;
  } catch (error) {
    alert("Fehler beim Laden der Gruppeninfo!");
  }
};
const nickname = (userID: number, duDich:string):string => {
  if(userID === getMyUserID()) return duDich;
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
      <div class="title-and-amount"> 
        <span><i>{{ nickname(payment.by,'Du') }}</i> an <i>{{ nickname(payment.to, 'Dich') }}</i></span>
        <span>{{ payment.amount.toFixed(2) }} €</span>
      </div>
    </div>
  </div>
</template>
