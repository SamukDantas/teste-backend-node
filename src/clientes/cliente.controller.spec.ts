import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';

describe('ClienteController', () => {
  let controller: ClienteController;
  let service: ClienteService;

  beforeEach(async () => {
    const mockService = {
      criarCliente: jest.fn(),
      listarClientes: jest.fn(),
      buscarCliente: jest.fn(),
      atualizarCliente: jest.fn(),
      deletarCliente: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [{ provide: ClienteService, useValue: mockService }],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
    service = module.get<ClienteService>(ClienteService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar um cliente', async () => {
    const novoCliente = {
      nomeCompleto: 'João Silva',
      dataNascimento: '1990-01-01',
      ativo: true,
      enderecos: ['Rua A'],
      contatos: [
        { email: 'joao@email.com', telefone: '123456789', principal: true },
      ],
    };

    const clienteCriado = { ...novoCliente, id: '1' };
    jest.spyOn(service, 'criarCliente').mockResolvedValue(clienteCriado);

    const response = await controller.criarCliente(novoCliente);
    expect(response.cliente).toEqual(clienteCriado);
  });

  it('deve listar clientes', async () => {
    const clientes = [
      {
        id: '1',
        nomeCompleto: 'João Silva',
        dataNascimento: '1990-01-01',
        ativo: true,
        enderecos: ['Rua A'],
        contatos: [],
      },
    ];

    jest.spyOn(service, 'listarClientes').mockResolvedValue(clientes);

    const response = await controller.listarClientes();
    expect(response).toEqual(clientes);
  });
});
