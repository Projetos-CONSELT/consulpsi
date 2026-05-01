## Problema

O `scrollIntoView` atual não leva em conta a altura do header fixo, fazendo a seção "Quem Somos" ficar parcialmente escondida atrás do cabeçalho.

## Solução

Alterar a função `handleClick` no `Header.tsx` (linha 25-28) para usar `window.scrollTo` com um offset que desconta a altura do header. Isso afeta todos os botões de navegação (desktop e mobile), em todos os dispositivos.

### Mudança em `src/components/Header.tsx`

Substituir:
```ts
const handleClick = useCallback((href: string) => {
  setMobileOpen(false);
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}, []);
```

Por:
```ts
const handleClick = useCallback((href: string) => {
  setMobileOpen(false);
  const el = document.querySelector(href);
  if (el) {
    const header = document.querySelector("header");
    const headerHeight = header?.getBoundingClientRect().height ?? 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: "smooth" });
  }
}, []);
```

O offset de `headerHeight + 8px` garante que o título fique levemente abaixo do cabeçalho em qualquer dispositivo. Nenhum outro arquivo ou elemento será alterado.
