# LenD crawler

## 1. Dev mode

1. install node.js > 20.0
   check node version

```bash
node -v
```

2. install pnpm

```bash
npm install -g pnpm
```

3. install dependencies

```bash
pnpm i
```

4. run dev for specific package

```bash
pnpm dev:crawl
```

## 2. Debug mode

1. run dev mode

Global dev mode

```ts
pnpm dev
```

Specific package dev mode

```ts
pnpm dev:crawl
```

2. add debugger in code

```ts
debugger
const pleaseStopHere = 1
```

-   `debugger` keyword will stop code execution and open debugger in vscode
-   remove `debugger` keyword when commit

3. run debugger in vscode

    1. Goto 실행 및 디버그
    2. package에 맞는 디버거 선택

4. press `F5` to start debug

## 3. Build mode

> **Build phase**
>
> 1. compile typescript into javascript to run in browser
> 2. bundle javascript into one file called `index.js`
> 3. generate type definition file called `index.d.ts`

1. How to build?

```bash
pnpm build
```

2. Check build result at `/packages/[package_name]/dist`

```bash
- index.js
- index.d.ts
...etc
```

## 4. Install package

-> 단팥 불러
