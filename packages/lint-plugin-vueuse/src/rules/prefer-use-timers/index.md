# `vueuse/prefer-use-timers`

Prefer VueUse timer composables over raw timers in component code. `useTimeoutFn()` and `useIntervalFn()` bind timer disposal to Vue scopes and avoid orphaned timers after unmount.

## Incorrect

```ts
const id = setInterval(poll, 1000)
```

## Correct

```ts
const { pause, resume } = useIntervalFn(poll, 1000)
```
