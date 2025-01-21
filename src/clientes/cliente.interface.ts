export interface Cliente {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  ativo: boolean;
  enderecos: string[];
  contatos: { email: string; telefone: string; principal: boolean }[];
}
