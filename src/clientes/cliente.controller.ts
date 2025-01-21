import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.interface';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async criarCliente(@Body() body: Omit<Cliente, 'id'>) {
    const cliente = await this.clienteService.criarCliente(body);
    return { message: 'Cliente criado com sucesso!', cliente };
  }

  @Get()
  async listarClientes() {
    const clientes = await this.clienteService.listarClientes();
    return clientes;
  }

  @Get(':id')
  async buscarCliente(@Param('id') id: string) {
    const cliente = await this.clienteService.buscarCliente(id);
    if (!cliente) {
      return { statusCode: 404, message: 'Cliente não encontrado' };
    }
    return cliente;
  }

  @Put(':id')
  async atualizarCliente(
    @Param('id') id: string,
    @Body() updates: Partial<Omit<Cliente, 'id'>>,
  ) {
    await this.clienteService.atualizarCliente(id, updates);
    return { message: 'Cliente atualizado com sucesso!' };
  }

  @Delete(':id')
  async deletarCliente(@Param('id') id: string) {
    await this.clienteService.deletarCliente(id);
    return { message: 'Cliente deletado com sucesso!' };
  }
}
