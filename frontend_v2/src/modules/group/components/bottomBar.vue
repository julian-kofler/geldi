<script setup lang="ts">
import {onMounted, ref} from "vue"
import { getBackend } from "@/components/backendHandler";
import type { CompensationPayment } from "@/components/types";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const my_cost = ref<number>(0); 
const my_saldo = ref<number>(0); 
const total_cost = ref<number>(0); 

const fetchMyCost = async () => {
  const res = await getBackend(`/expenses/my-cost?groupId=${route.params.groupID}`);
  my_cost.value=res.result;
};
const fetchMySaldo = async () => {
  const res = await getBackend(`/expenses/my-saldo?groupId=${route.params.groupID}`);
  my_saldo.value=res.result;
};
const fetchMyTotalCost = async () => {
  const res = await getBackend(`/expenses/total-cost?groupId=${route.params.groupID}`);
  total_cost.value=res.result;
};

const NumberToAmountString = (num:number):string => {
  return num.toFixed(2).replace('.', ',') + '€';
};
onMounted(()=>{
  try {
    fetchMyCost();
    fetchMySaldo();
    fetchMyTotalCost();
  } catch (error) {
    alert("Fehler beim Laden der Kosten");
  }
})
</script>

<template>
  <div class="bar bottom-bar">
    <div class="bottom-bar-item">
      <div class="cost-label">Meine Kosten</div>
      <div class="cost-value">{{NumberToAmountString(my_cost)}}</div>
    </div>
    <div class="bottom-bar-item">
      <div class="cost-label">Mein Saldo</div>
      <div class="cost-value">{{NumberToAmountString(my_saldo)}}</div>
    </div>
    <div class="bottom-bar-item">
      <div class="cost-label">Gesamte Kosten</div>
      <div class="cost-value">{{NumberToAmountString(total_cost)}}</div>
    </div>
  </div>
</template>
