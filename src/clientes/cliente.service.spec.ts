import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

jest.mock('@aws-sdk/client-dynamodb'); // Mock do DynamoDBClient

describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteService],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um cliente', async () => {
    // Mock do método send do DynamoDBClient
    DynamoDBClient.prototype.send = jest.fn().mockResolvedValueOnce({});

    const novoCliente = {
      nomeCompleto: 'João Silva',
      dataNascimento: '1990-01-01',
      ativo: true,
      enderecos: ['Rua A'],
      contatos: [
        { email: 'joao@email.com', telefone: '123456789', principal: true },
      ],
    };

    const clienteCriado = await service.criarCliente(novoCliente);
    expect(clienteCriado).toHaveProperty('id');
    expect(clienteCriado.nomeCompleto).toBe(novoCliente.nomeCompleto);
  });

  it('deve listar clientes', async () => {
    // Mock do método send do DynamoDBClient
    DynamoDBClient.prototype.send = jest.fn().mockResolvedValueOnce({
      Items: [
        {
          id: { S: '1' },
          nomeCompleto: { S: 'João Silva' },
          dataNascimento: { S: '1990-01-01' },
          ativo: { BOOL: true },
          enderecos: { SS: ['Rua A'] },
          contatos: {
            S: JSON.stringify([
              {
                email: 'joao@email.com',
                telefone: '123456789',
                principal: true,
              },
            ]),
          },
        },
      ],
    });

    const clientes = await service.listarClientes();
    expect(clientes).toHaveLength(1);
    expect(clientes[0].nomeCompleto).toBe('João Silva');
  });
});
