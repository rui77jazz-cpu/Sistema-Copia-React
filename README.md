# 📚 Sistema de Cópia/Leitura Dinâmica para Alunos (SistemaCopia)

Este é um componente React (TypeScript/JSX) que simula um leitor dinâmico (*speed reader*) ou um sistema de cópia cronometrado. É ideal para estudantes que desejam melhorar a velocidade de leitura e a precisão da cópia de texto.

O componente permite que o utilizador insira um bloco de texto e o visualize palavra por palavra no centro do ecrã, controlando a velocidade em Palavras Por Minuto (PPM).

## ✨ Funcionalidades Principais

* **Leitura Dinâmica (Speed Reading):** Apresentação do texto palavra por palavra no centro do ecrã a uma velocidade totalmente configurável (PPM).
* **Controlo de Velocidade:** Ajuste fino da velocidade de leitura, permitindo valores de **5 PPM até 240 PPM**.
* **Destaque e Contexto:** A palavra atual em leitura é destacada no bloco de texto superior, permitindo ao aluno manter o contexto sem perder o progresso.
* **Personalização de Visualização:** Controlo do tamanho e tipo de letra para o bloco de referência e para a palavra em destaque.
* **Estatísticas Detalhadas de Leitura:**
    * Contagem de palavras lidas e restantes.
    * Tempo decorrido.
    * Número de pausas e retrocessos registados.
    * Percentagem de conclusão.
* **Relatório de Atividade:** Geração de um relatório detalhado no final da sessão com opção de cópia fácil para o clipboard.
* **Navegação Rápida:** Botões para `Anterior` (retrocesso), `Próximo` (avança uma palavra) e `Pausar/Continuar`.

## 🛠️ Tecnologias Utilizadas

Este componente é construído com tecnologias modernas de desenvolvimento web:

* **React** (com TypeScript - `.tsx`)
* **Tailwind CSS** (Classes utilitárias integradas no JSX para toda a estilização e layout da interface).

## 📦 Como Usar em um Projeto React

Este componente foi desenhado para ser integrado em qualquer aplicação React existente, como as criadas com Vite, Next.js ou Create React App.

### 1. Pré-Requisito

O seu projeto deve estar configurado para utilizar **Tailwind CSS**, uma vez que a estilização do `SistemaCopia.tsx` depende totalmente das suas classes utilitárias.

### 2. Integração do Componente

1.  Certifique-se de que o ficheiro `SistemaCopia.tsx` está na sua estrutura (e.g., em `src/components/`).
2.  Importe e utilize o componente no ficheiro principal da sua aplicação (e.g., `App.tsx`):

```tsx
// App.tsx
import SistemaCopia from './components/SistemaCopia'; // Ajuste o caminho conforme necessário

function App() {
  return (
    // Certifique-se de que o div raiz tem as classes básicas do Tailwind
    <div className="min-h-screen bg-gray-100">
      <SistemaCopia />
    </div>
  );
}

export default App;
