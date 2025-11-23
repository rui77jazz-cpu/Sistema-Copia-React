import React, { useState, useEffect, useRef } from 'react';

const SistemaCopia = () => {
  const [texto, setTexto] = useState('');
  const [palavras, setPalavras] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [emExibicao, setEmExibicao] = useState(false);
  const [pausado, setPausado] = useState(true);
  const [velocidade, setVelocidade] = useState(6);
  const [palavrasPorMinuto, setPalavrasPorMinuto] = useState(10);
  const [palavrasAtuais, setPalavrasAtuais] = useState({primeira: '', segunda: ''});
  const [textoVisivel, setTextoVisivel] = useState([]);
  const [mostrarTextoInicial, setMostrarTextoInicial] = useState(true);
  const [palavrasDestaque, setPalavrasDestaque] = useState([]);
  
  const [tamanhoFonteSuperior, setTamanhoFonteSuperior] = useState(16);
  const [tamanhoFonteInferior, setTamanhoFonteInferior] = useState(24);
  const [fonteSuperior, setFonteSuperior] = useState('Arial');
  const [fonteInferior, setFonteInferior] = useState('Arial');
  
  const [totalPalavrasLidas, setTotalPalavrasLidas] = useState(0);
  const [numeroPausas, setNumeroPausas] = useState(0);
  const [numeroRetrocessos, setNumeroRetrocessos] = useState(0);
  const [horaInicio, setHoraInicio] = useState(null);
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);
  
  const intervalRef = useRef(null);
  const textoInputRef = useRef(null);
  const textoSuperiorRef = useRef(null);
  const palavraAtualRef = useRef(null);
  
  useEffect(() => {
    const segundosPorPalavra = 60 / palavrasPorMinuto;
    setVelocidade(segundosPorPalavra);
  }, [palavrasPorMinuto]);
  
  useEffect(() => {
    if (emExibicao && !pausado && velocidade > 0) {
      intervalRef.current = setInterval(() => {
        avancarPalavras();
      }, velocidade * 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [emExibicao, pausado, velocidade, indiceAtual]);
  
  const processarTexto = (textoOriginal) => {
    const palavrasArray = [];
    const linhas = textoOriginal.split('\n');
    
    linhas.forEach((linha, indexLinha) => {
      if (linha.trim() === '') {
        palavrasArray.push('\n');
      } else {
        const palavrasLinha = linha.split(/(\s+)/);
        palavrasLinha.forEach(item => {
          if (item.trim() !== '') {
            palavrasArray.push(item);
          } else if (item.length > 0) {
            palavrasArray.push(item);
          }
        });
        if (indexLinha < linhas.length - 1) {
          palavrasArray.push('\n');
        }
      }
    });
    
    return palavrasArray;
  };
  
  const avancarPalavras = () => {
    if (indiceAtual >= palavras.length - 1) {
      // Garantir que a última palavra foi contabilizada
      const ultimaPalavra = palavras[palavras.length - 1];
      const ehUltimaPalavraReal = ultimaPalavra !== '\n' && ultimaPalavra.trim() !== '';
      
      if (ehUltimaPalavraReal && totalPalavrasLidas < totalPalavras) {
        setTotalPalavrasLidas(totalPalavras);
      }
      
      setPausado(true);
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const playNote = (frequency, startTime, duration) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };
        
        const now = audioContext.currentTime;
        playNote(523.25, now, 0.2);
        playNote(659.25, now + 0.2, 0.2);
        playNote(783.99, now + 0.4, 0.2);
        playNote(1046.50, now + 0.6, 0.4);
      } catch (e) {
        console.log('Audio not supported');
      }
      
      setTimeout(() => {
        alert('Parabéns! Texto concluído!');
      }, 800);
      return;
    }
    
    // Verificar se vamos avançar para uma palavra real
    const proximaPalavra = palavras[indiceAtual];
    const ehPalavraReal = proximaPalavra !== '\n' && proximaPalavra.trim() !== '';
    
    // Só incrementa se for uma palavra real E se não estamos pausados
    if (ehPalavraReal && !pausado) {
      setTotalPalavrasLidas(prev => prev + 1);
    }
    
    setIndiceAtual(prev => prev + 1);
    atualizarVisualizacao(indiceAtual + 1);
  };
  
  const voltarPalavras = () => {
    if (indiceAtual <= 0) return;
    
    // Verificar se a palavra atual é uma palavra real antes de decrementar
    const palavraAtual = palavras[indiceAtual - 1];
    const ehPalavraReal = palavraAtual !== '\n' && palavraAtual.trim() !== '';
    
    if (ehPalavraReal) {
      setTotalPalavrasLidas(prev => Math.max(0, prev - 1));
    }
    
    setNumeroRetrocessos(prev => prev + 1);
    setIndiceAtual(prev => Math.max(0, prev - 1));
    atualizarVisualizacao(indiceAtual - 1);
  };
  
  const atualizarVisualizacao = (indice) => {
    if (indice >= 0 && indice < palavras.length) {
      const textoAteAgora = palavras.slice(0, indice + 1);
      let ultimaPalavra = '';
      
      for (let i = textoAteAgora.length - 1; i >= 0; i--) {
        if (textoAteAgora[i] !== '\n' && textoAteAgora[i].trim() !== '') {
          ultimaPalavra = textoAteAgora[i];
          break;
        }
      }
      
      setPalavrasAtuais({
        primeira: ultimaPalavra,
        segunda: ''
      });
      
      setPalavrasDestaque([ultimaPalavra]);
      setTextoVisivel(textoAteAgora);
      
      setTimeout(() => {
        if (palavraAtualRef.current && textoSuperiorRef.current) {
          palavraAtualRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 50);
    }
  };
  
  const iniciarExibicao = () => {
    if (!texto.trim()) {
      alert('Por favor, insira um texto para começar.');
      return;
    }
    
    const novasPalavras = processarTexto(texto);
    setPalavras(novasPalavras);
    setIndiceAtual(0);
    setPausado(false);
    setEmExibicao(true);
    setMostrarTextoInicial(false);
    setHoraInicio(new Date());
    setNumeroPausas(0);
    setNumeroRetrocessos(0);
    setTotalPalavrasLidas(0);
    
    setPalavrasAtuais({
      primeira: novasPalavras[0] || '',
      segunda: novasPalavras[1] || ''
    });
    setTextoVisivel([novasPalavras[0]]);
  };
  
  const alternarPausa = () => {
    if (!pausado) {
      setNumeroPausas(prev => prev + 1);
    }
    setPausado(!pausado);
  };
  
  const reiniciarExibicao = () => {
    setIndiceAtual(0);
    setPausado(true);
    setPalavrasAtuais({primeira: '', segunda: ''});
    setTextoVisivel([]);
    setTotalPalavrasLidas(0);
    setNumeroPausas(0);
    setNumeroRetrocessos(0);
    setHoraInicio(new Date());
    
    if (palavras.length > 0) {
      setPalavrasAtuais({
        primeira: palavras[0] || '',
        segunda: palavras[1] || ''
      });
      setTextoVisivel([palavras[0]]);
    }
  };
  
  const novoTexto = () => {
    setTexto('');
    setMostrarTextoInicial(true);
    setPalavras([]);
    setIndiceAtual(0);
    setPausado(true);
    setEmExibicao(false);
    setPalavrasAtuais({primeira: '', segunda: ''});
    setTextoVisivel([]);
    setTotalPalavrasLidas(0);
    setNumeroPausas(0);
    setNumeroRetrocessos(0);
    setHoraInicio(null);
    
    setTimeout(() => {
      if (textoInputRef.current) {
        textoInputRef.current.focus();
      }
    }, 100);
  };
  
  const copiarRelatorio = () => {
    const tempoDecorrido = horaInicio ? Math.floor((new Date() - horaInicio) / 1000) : 0;
    const minutos = Math.floor(tempoDecorrido / 60);
    const segundos = tempoDecorrido % 60;
    const totalPalavras = palavras.filter(p => p !== '\n' && p.trim() !== '').length;
    const percentagem = Math.round((totalPalavrasLidas / Math.max(1, totalPalavras)) * 100);
    
    const relatorioTexto = `RELATÓRIO DE ATIVIDADE DE LEITURA

Data: ${new Date().toLocaleDateString('pt-PT')}
Hora: ${new Date().toLocaleTimeString('pt-PT')}

ESTATÍSTICAS DA SESSÃO
Total de palavras do texto: ${totalPalavras}
Palavras lidas: ${totalPalavrasLidas}
Percentagem concluída: ${percentagem}%
Tempo decorrido: ${minutos}m ${segundos}s
Velocidade utilizada: ${palavrasPorMinuto} PPM
Número de pausas: ${numeroPausas}
Número de retrocessos: ${numeroRetrocessos}

Gerado por: Sistema de Cópia para Alunos`;
    
    navigator.clipboard.writeText(relatorioTexto).then(() => {
      alert('Relatório copiado! Agora pode colar no Word.');
    }).catch(() => {
      alert('Erro ao copiar. Tente novamente.');
    });
  };
  
  const totalPalavras = palavras.filter(p => p !== '\n' && p.trim() !== '').length;
  const palavrasRestantes = Math.max(0, totalPalavras - totalPalavrasLidas);
  const percentagemConcluida = Math.min(100, Math.max(0, Math.round((totalPalavrasLidas / Math.max(1, totalPalavras)) * 100)));
  
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-blue-700">Sistema de Cópia para Alunos</h1>
      </div>
      
      {mostrarTextoInicial ? (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <label className="block mb-2 font-medium">
            Insira o texto original:
          </label>
          <textarea
            ref={textoInputRef}
            className="w-full p-3 border border-gray-300 rounded-md h-40 mb-4"
            placeholder="Digite ou cole o texto aqui..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          
          <button
            onClick={iniciarExibicao}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Iniciar Exibição
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {emExibicao && (
            <div className="bg-blue-50 p-2 rounded-lg shadow-md mb-6">
              <div className="flex gap-3 items-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">📚 {palavrasRestantes}</div>
                  <div className="text-xs text-gray-600">Faltam</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    ⏱️ {(() => {
                      const segundosTotais = Math.round(palavrasRestantes * velocidade);
                      const minutos = Math.floor(segundosTotais / 60);
                      const segundos = segundosTotais % 60;
                      return minutos > 0 ? `${minutos}m${segundos}s` : `${segundos}s`;
                    })()}
                  </div>
                  <div className="text-xs text-gray-600">Tempo restante</div>
                </div>
                <div className="text-center">
                  <label className="text-xs font-medium text-gray-700 block mb-1">Velocidade</label>
                  <select
                    value={palavrasPorMinuto}
                    onChange={(e) => setPalavrasPorMinuto(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded-md text-base font-bold text-orange-600"
                  >
                    <option value={5}>5 PPM</option>
                    <option value={6}>6 PPM</option>
                    <option value={8}>8 PPM</option>
                    <option value={10}>10 PPM</option>
                    <option value={12}>12 PPM</option>
                    <option value={15}>15 PPM</option>
                    <option value={20}>20 PPM</option>
                    <option value={30}>30 PPM</option>
                    <option value={40}>40 PPM</option>
                    <option value={60}>60 PPM</option>
                    <option value={80}>80 PPM</option>
                    <option value={90}>90 PPM</option>
                    <option value={120}>120 PPM</option>
                    <option value={150}>150 PPM</option>
                    <option value={180}>180 PPM</option>
                    <option value={240}>240 PPM</option>
                  </select>
                  <div className="text-xs text-gray-600 mt-1">Palavras/min</div>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                  <div className="text-center">
                    <span className="text-lg font-bold text-blue-600">{percentagemConcluida}%</span>
                    <span className="text-xs text-gray-600 ml-1">concluído</span>
                  </div>
                  <div className="relative bg-gray-300 rounded-lg h-2 w-32 border border-gray-400 overflow-hidden shadow-inner">
                    <div 
                      className="h-full transition-all duration-500 relative"
                      style={{ 
                        width: `${percentagemConcluida}%`,
                        background: percentagemConcluida < 30 ? '#EF4444' : percentagemConcluida < 70 ? '#F59E0B' : '#10B981'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
                    </div>
                    <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-0.5 h-1.5 bg-gray-400 rounded-r"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-6">
            <div ref={textoSuperiorRef} className="bg-white p-6 rounded-lg shadow-md h-64 overflow-y-auto">
              <div style={{ fontFamily: fonteSuperior, fontSize: `${tamanhoFonteSuperior}px`, whiteSpace: 'pre-wrap' }}>
                {textoVisivel.map((palavra, idx) => {
                  if (palavra === '\n') {
                    return <br key={idx} />;
                  }
                  const ehDestaque = palavra === palavrasDestaque[0] && idx === textoVisivel.length - 1;
                  return (
                    <span 
                      key={idx}
                      ref={ehDestaque ? palavraAtualRef : null}
                      style={{
                        backgroundColor: ehDestaque ? '#FFEB3B' : 'transparent',
                        fontSize: ehDestaque ? `${tamanhoFonteInferior}px` : `${tamanhoFonteSuperior}px`,
                        fontWeight: ehDestaque ? 'bold' : 'normal',
                        color: ehDestaque ? '#16A34A' : 'inherit',
                        padding: '2px'
                      }}
                    >
                      {palavra}
                    </span>
                  );
                })}
              </div>
            </div>
            
            <div className={`${indiceAtual >= palavras.length - 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-green-600'} p-6 rounded-lg shadow-md flex justify-center items-center h-24`}>
              {indiceAtual >= palavras.length - 1 ? (
                <div className="text-center">
                  <div className="text-5xl mb-2">🎉</div>
                  <span 
                    style={{ 
                      fontFamily: fonteInferior, 
                      fontSize: `${tamanhoFonteInferior + 8}px`,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    PARABÉNS TERMINOU
                  </span>
                </div>
              ) : (
                <span 
                  style={{ 
                    fontFamily: fonteInferior, 
                    fontSize: `${tamanhoFonteInferior}px`,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {palavrasAtuais.primeira}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              <button 
                onClick={voltarPalavras}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Anterior
              </button>
              <button 
                onClick={alternarPausa}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {pausado ? 'Continuar' : 'Pausar'}
              </button>
              <button 
                onClick={avancarPalavras}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Próximo
              </button>
              <button 
                onClick={reiniciarExibicao}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Reiniciar
              </button>
              <button 
                onClick={novoTexto}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Novo Texto
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={voltarPalavras}
                className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-4 px-6 rounded-l-full shadow-md transition"
              >
                ← Anterior
              </button>
              <button
                onClick={avancarPalavras}
                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-4 px-6 rounded-r-full shadow-md transition"
              >
                Próximo →
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="min-w-32">
                Ajuste fino ({velocidade.toFixed(2)}s/palavra):
              </label>
              <input
                type="range"
                min="0.25"
                max="20"
                step="0.25"
                value={velocidade}
                onChange={(e) => {
                  const novaVelocidade = parseFloat(e.target.value);
                  setVelocidade(novaVelocidade);
                  const novoPPM = 60 / novaVelocidade;
                  const opcoesDisponiveis = [5, 6, 8, 10, 12, 15, 20, 30, 40, 60, 80, 90, 120, 150, 180, 240];
                  const maisProximo = opcoesDisponiveis.reduce((prev, curr) => 
                    Math.abs(curr - novoPPM) < Math.abs(prev - novoPPM) ? curr : prev
                  );
                  setPalavrasPorMinuto(maisProximo);
                }}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 font-bold min-w-20">{(60 / velocidade).toFixed(1)} PPM</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="min-w-40 text-sm">Tamanho Fonte Superior:</label>
                <input
                  type="range"
                  min="10"
                  max="48"
                  value={tamanhoFonteSuperior}
                  onChange={(e) => setTamanhoFonteSuperior(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="min-w-12 text-center text-sm">{tamanhoFonteSuperior}px</span>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="min-w-40 text-sm">Tamanho Fonte Inferior:</label>
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={tamanhoFonteInferior}
                  onChange={(e) => setTamanhoFonteInferior(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="min-w-12 text-center text-sm">{tamanhoFonteInferior}px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="min-w-40 text-sm">Fonte Superior:</label>
                <select
                  value={fonteSuperior}
                  onChange={(e) => setFonteSuperior(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Impact">Impact</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Calibri">Calibri</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="min-w-40 text-sm">Fonte Inferior:</label>
                <select
                  value={fonteInferior}
                  onChange={(e) => setFonteInferior(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Impact">Impact</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Calibri">Calibri</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setMostrarRelatorio(true)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-bold text-lg"
            >
              📊 Gerar Relatório da Atividade
            </button>

            {mostrarRelatorio && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
                  <h2 className="text-2xl font-bold mb-4 text-blue-700">📊 Relatório de Atividade</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold">Data:</span> {new Date().toLocaleDateString('pt-PT')}
                      </div>
                      <div>
                        <span className="font-semibold">Hora:</span> {new Date().toLocaleTimeString('pt-PT')}
                      </div>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <h3 className="font-bold text-lg text-gray-700 mb-2">Estatísticas da Sessão</h3>
                    
                    <div className="space-y-2 bg-gray-50 p-4 rounded">
                      <div className="flex justify-between">
                        <span>Total de palavras do texto:</span>
                        <span className="font-bold">{totalPalavras}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Palavras lidas:</span>
                        <span className="font-bold text-green-600">{totalPalavrasLidas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Percentagem concluída:</span>
                        <span className="font-bold text-blue-600">{percentagemConcluida}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo decorrido:</span>
                        <span className="font-bold">
                          {horaInicio ? (() => {
                            const diff = Math.floor((new Date() - horaInicio) / 1000);
                            const m = Math.floor(diff / 60);
                            const s = diff % 60;
                            return `${m}m ${s}s`;
                          })() : '0m 0s'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Velocidade utilizada:</span>
                        <span className="font-bold text-orange-600">{palavrasPorMinuto} PPM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Número de pausas:</span>
                        <span className="font-bold">{numeroPausas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Número de retrocessos:</span>
                        <span className="font-bold">{numeroRetrocessos}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={copiarRelatorio}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-bold"
                    >
                      📋 Copiar Relatório
                    </button>
                    <button
                      onClick={() => setMostrarRelatorio(false)}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition font-bold"
                    >
                      ✕ Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SistemaCopia;