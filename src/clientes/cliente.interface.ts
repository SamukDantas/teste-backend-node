// cliente.interface.ts
export interface Cliente {
  id?: string; // Torna o id opcional
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
