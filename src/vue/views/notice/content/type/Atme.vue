<template>
<div class="notice_content_type_atme">
  <div class="nct_atme-header">
    <div class="nct_atme-header-filter">@我</div>
    <div class="nct_atme-header-operation">
      <i class="ibass ibass-more"></i>
    </div>
  </div>
  <AtmeCard :messageRead="true"></AtmeCard>
  <AtmeCard></AtmeCard>
  <AtmeCard></AtmeCard>
</div>
</template>
<script>
import AtmeCard from '../../components/AtmeCard'
export default {
  components: {
    AtmeCard
  },
  data: () => ({})
}
</script>
<style lang="scss" scoped>
.nct_atme-header {
    height: 48px;
    margin: 0 16px;
    @include flex(row, space-between, center);
    .ibass {
        vertical-align: middle;
    }
    .nct_atme-header-filter {
        font-size: 12px;
        color: $color-text-almost-black;
    }
    .nct_atme-header-operation {
        .ibass-more {
            line-height: 16px;
        }
    }
}
</style>
