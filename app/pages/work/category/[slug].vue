<script setup lang="ts">
import { categories } from '~/data/site'
const route = useRoute()
const cat = categories.find((c) => c.slug === route.params.slug)
if (!cat) throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
useSeoMeta({ title: `${cat.title} — Work — Afeez Was Here` })
</script>

<template><div /></template>
