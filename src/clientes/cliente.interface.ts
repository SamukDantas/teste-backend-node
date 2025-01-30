export interface Cliente {
  id?: string;
  nomeCompleto: string;
  dataNascimento: string;
  ativo: boolean;
  enderecos: string[];
  contatos: Contato[];
}

export interface Contato {
  email: string;
  telefone: string;
  principal: boolean;
}
