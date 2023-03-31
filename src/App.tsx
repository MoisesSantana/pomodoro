import { ThemeProvider } from 'styled-components'
import { CycleProvider } from './contexts/CycleContext'
import { Router } from './Router'
import { GlobalStyled } from './styles/global'
import { defaultTheme } from './styles/themes/default'
function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CycleProvider>
        <Router />
      </CycleProvider>
      <GlobalStyled />
    </ThemeProvider>
  )
}

export default App
