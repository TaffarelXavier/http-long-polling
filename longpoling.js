/**
 * 
 * Descrição:
 *          Este Plugin é usado para fazer LongPoling
 * 
 * Precisa de um método parecido a este:
 *  var objAjax = function (_data) {
 $("#resultado").html(_data);
 };
 */
var ls = window.localStorage;
(function($) {
    var d = $.fn.LongPoling = function(options) {
        //Verifica se o usuário está na página
        var estaNaPagina = true;
        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            nomeDaVariavelLocalStorage: "dados",
            url: "",
            tempoCarregamento: 1000,
            metodo: "POST",
            dataHttp: {},
            objetoParaPreencher: '',
            receberDados: null
        }, options);
        /*
         * <p>Preenche os dados por linha</p>
         * @param {type} msg
         * @returns {undefined}
         */
        function preencherTabela(msg) {
            $("#tabelaCorpo").append(msg);
            $('#carregando').hide();
        }
        function carregarDadosLong() {
            if (estaNaPagina == true) {
                $.ajax({
                    type: settings.metodo,
                    url: settings.url,
                    async: true,
                    cache: false,
                    timeout: 50000,
                    data: settings.dataHttp,
                    /*{tipo_de_carregamento: 'periodo', ultimo_id: isNaN(_ultimoId) ? 0 : _ultimoId}*/
                    success: settings.receberDados,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        preencherTabela(textStatus + " (" + errorThrown + ")");
                        setTimeout(carregarDadosLong, 10000);
                    }
                });
            }
        }
        //
        //Para carregar de tempos em tempos:
        window.setInterval(carregarDadosLong, settings.tempoCarregamento);
        /**
         * <p style="font:12px Tahoma;">Tem quase a mesma funcionalidade da função: <b>carregarDadosLong</b>, com uma diferença:
         * esta carrega todos os dados de uma única, aquela busca registro por registro se for maior que o número maior da coluna
         * ID.</p>
         * 
         * @returns {undefined}
         */
        function carregarTodosOsDados() {
            $.ajax({
                type: settings.metodo,
                url: settings.url,
                async: true,
                cache: false,
                timeout: 50000,
                data: settings.dataHttp,
                /*{tipo_de_carregamento: 'periodo', ultimo_id: isNaN(_ultimoId) ? 0 : _ultimoId}*/
                success: settings.receberDados,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    preencherTabela(textStatus + " (" + errorThrown + ")");
                    setTimeout(carregarDadosLong, 10000);
                }
            });
        }
        //Ao entrar na página
        window.onfocus = function() {
            estaNaPagina = true;
        };
        //Ao sair da página
        window.onblur = function() {
            estaNaPagina = false;
        };
        //Carrega todos os dados de uma vez
        carregarTodosOsDados();
        /**
         *Evento: se o usuário sair da página, então a variável estaNaPagina recebe o valor de false.
         *Quando o usuário sai da página,o evento visibilitychange define a propriedade
         *visibilityState para hidden, quando ele retorna, então, visibilityState recebe o valor de <b>visible</b>.
         * @type type
         */
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState == 'visible') {
                estaNaPagina = true;
                carregarTodosOsDados();
            } else {
                estaNaPagina = false;
            }
        }, false);
        return this.each(function() {
            return ls.getItem(settings.nomeDaVariavelLocalStorage);
        });
    };
}(jQuery));