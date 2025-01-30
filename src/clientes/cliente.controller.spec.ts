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

  it('deve buscar um cliente por ID', async () => {
    const cliente = {
      id: '1',
      nomeCompleto: 'João Silva',
      dataNascimento: '1990-01-01',
      ativo: true,
      enderecos: ['Rua A'],
      contatos: [],
    };

    jest.spyOn(service, 'buscarCliente').mockResolvedValue(cliente);

    const response = await controller.buscarCliente('1');
    expect(response).toEqual(cliente);
  });

  it('deve atualizar um cliente', async () => {
    const clienteAtualizado = {
      nomeCompleto: 'João Silva',
      dataNascimento: '1990-01-01',
      ativo: false,
      enderecos: ['Rua B'],
      contatos: [],
    };

    const clienteRetornado = {
      id: '1',
      ...clienteAtualizado,
    };

    jest.spyOn(service, 'atualizarCliente').mockResolvedValue(clienteRetornado);

    const response = await controller.atualizarCliente('1', clienteAtualizado);
    expect(response).toEqual(clienteRetornado);
  });

  it('deve deletar um cliente', async () => {
    jest.spyOn(service, 'deletarCliente').mockResolvedValue(undefined);

    const response = await controller.deletarCliente('1');
    expect(response).toBe(true);
  });
});
