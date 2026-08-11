# `@nustack/nuxt/no-unserializable-use-state`

Disallow values in `useState` initializers that Nuxt's default payload serializer cannot transfer from the server to the client.

Nuxt serializes state with `devalue`. In addition to plain objects, arrays, and primitives, it supports types such as `Date`, `URL`, `RegExp`, `Map`, `Set`, `BigInt`, `ArrayBuffer`, and typed arrays. Functions, symbols, symbol-keyed objects, and arbitrary class instances are not supported by default.

Incorrect:

```ts
const user = useState('user', () => new User())
const formatter = useState('formatter', () => (value: string) => value.trim())
const token = useState('token', () => Symbol('token'))
```

Correct:

```ts
const user = useState('user', () => ({ id: 1, name: 'Ada' }))
const createdAt = useState('created-at', () => new Date())
const selectedIds = useState('selected-ids', () => new Set<number>())
```

The rule checks values returned directly by initializer callbacks. Dynamic factory results and later mutations of the state ref are outside its scope.

Custom payload reducers are intentionally not inferred from source code because it's expensive to infer the runtime type they accept. Declare supported constructors explicitly while keeping all other checks active:

```ts
nuxtConfigs({ payloadSerializableConstructors: ['DateTime', 'Prisma.Decimal'] })

// With @nustackjs/lint:
nustack({ nuxt: { payloadSerializableConstructors: ['DateTime'] } })
```

See [Nuxt's state management documentation](https://nuxt.com/docs/4.x/getting-started/state-management) and [custom reducer/reviver documentation](https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#custom-reducerreviver-v34).
