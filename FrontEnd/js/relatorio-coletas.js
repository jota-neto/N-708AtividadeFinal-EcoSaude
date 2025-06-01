document.addEventListener('DOMContentLoaded', () => {
    const relatorioForm = document.querySelector('.relatorio-form');
    const btnGerarPdf = document.getElementById('btn-gerar-pdf');
    const btnGerarExcel = document.getElementById('btn-gerar-excel');
    const areaResultados = document.getElementById('area-resultados-relatorio');

    const gerarRelatorioOuExportar = async (formato) => {
        if (!areaResultados) {
            console.error("Elemento 'area-resultados-relatorio' não encontrado no DOM.");
            alert("Erro na página: área de resultados não encontrada.");
            return;
        }

        const dataInicio = document.getElementById('data-inicio').value;
        const dataFim = document.getElementById('data-fim').value;
        const tipoResiduoRelatorio = document.getElementById('tipo-residuo-relatorio').value;

        if (!dataInicio || !dataFim) {
            alert('Por favor, selecione a Data de Início e a Data de Fim.');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('Sessão expirada ou usuário não logado. Faça o login novamente.');
            window.location.href = 'index.html';
            return;
        }

        let queryParams = `data_inicio=${encodeURIComponent(dataInicio)}&data_fim=${encodeURIComponent(dataFim)}`;
        if (tipoResiduoRelatorio) {
            queryParams += `&tipo_residuo=${encodeURIComponent(tipoResiduoRelatorio)}`;
        }

        if (formato === 'csv') {
            const apiUrlCsv = `http://localhost/N-708AtividadeFinal-EcoSaude/BackEnd/api/relatorios/exportar_coletas_csv.php?${queryParams}&token=${encodeURIComponent(token)}`;
            console.log("Chamando para CSV: ", apiUrlCsv);
            window.location.href = apiUrlCsv;
        } else if (formato === 'pdf_placeholder') {
             alert('Funcionalidade "Gerar PDF" para download direto ainda não implementada. Os dados serão exibidos na tela, se disponíveis.');
             // Para realmente gerar PDF, precisaríamos de mais lógica ou chamar um endpoint diferente.
             // Por enquanto, vamos chamar a exibição em tela como fallback.
             await gerarRelatorioOuExportar('tela'); // Chama para exibir na tela
        } else { 
            const apiUrlJson = `http://localhost/N-708AtividadeFinal-EcoSaude/BackEnd/api/relatorios/gerar_coletas.php?${queryParams}`;
            console.log("Chamando API para JSON (exibir na tela): ", apiUrlJson);
            areaResultados.innerHTML = '<p>Gerando relatório...</p>';

            try {
                const response = await fetch(apiUrlJson, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                
                areaResultados.innerHTML = ''; 

                if (response.ok) {
                    if (result.data && result.data.length > 0) {
                        areaResultados.innerHTML = `<h3>Relatório de Coletas</h3>
                                                    <p>Filtros: Início: ${result.filtros_usados.data_inicio}, Fim: ${result.filtros_usados.data_fim}, Tipo: ${result.filtros_usados.tipo_residuo || 'Todos'}</p>`;
                        
                        let tabelaHtml = `<table border="1">
                                            <thead>
                                                <tr>
                                                    <th>ID Coleta</th>
                                                    <th>Data Coleta</th>
                                                    <th>Tipo Resíduo Solicitado</th>
                                                    <th>Descrição</th>
                                                    <th>Status</th>
                                                    <th>Agendado Por</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;
                        result.data.forEach(coleta => {
                            tabelaHtml += `<tr>
                                              <td>${coleta.id_coleta}</td>
                                              <td>${coleta.data_coleta_formatada}</td>
                                              <td>${coleta.tipo_residuo_solicitado}</td>
                                              <td>${coleta.descricao_coleta || ''}</td>
                                              <td>${coleta.status}</td>
                                              <td>${coleta.nome_usuario_agendamento || 'N/A'}</td>
                                           </tr>`;
                        });
                        tabelaHtml += `</tbody></table>`;
                        areaResultados.innerHTML += tabelaHtml;
                    } else {
                        areaResultados.innerHTML = `<p>Nenhum dado encontrado para os filtros selecionados.</p>`;
                    }
                } else {
                     if (response.status === 401) {
                        alert(result.message || 'Sessão expirada ou token inválido. Faça login novamente.');
                        localStorage.removeItem('jwtToken');
                        window.location.href = 'index.html';
                     } else { 
                        areaResultados.innerHTML = `<p style="color:red;">Erro ao gerar relatório: ${result.message || response.statusText}</p>`; 
                     }
                }
            } catch (error) {
                console.error('Erro na comunicação para gerar relatório:', error);
                areaResultados.innerHTML = `<p style="color:red;">Ocorreu um erro de comunicação ao gerar o relatório.</p>`;
                alert('Ocorreu um erro de comunicação. Verifique o console.');
            }
        }
    };

    if (btnGerarPdf) {
        btnGerarPdf.addEventListener('click', () => gerarRelatorioOuExportar('pdf_placeholder'));
    }
    if (btnGerarExcel) {
        btnGerarExcel.addEventListener('click', () => gerarRelatorioOuExportar('csv'));
    }
});