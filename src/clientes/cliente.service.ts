import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
  ReturnValue,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Cliente } from './cliente.interface';

const dynamoCliente = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const TABLE_NAME = 'Clientes';

@Injectable()
export class ClienteService {
  async criarCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const novoCliente: Cliente = {
      id: uuidv4(),
      ...cliente,
    };

    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: { S: novoCliente.id },
        nomeCompleto: { S: novoCliente.nomeCompleto },
        dataNascimento: { S: novoCliente.dataNascimento },
        ativo: { BOOL: novoCliente.ativo },
        enderecos: { SS: novoCliente.enderecos },
        contatos: { S: JSON.stringify(novoCliente.contatos) },
      },
    };

    await dynamoCliente.send(new PutItemCommand(params));
    return novoCliente;
  }

  async listarClientes(): Promise<Cliente[]> {
    const params = {
      TableName: TABLE_NAME,
    };

    const result = await dynamoCliente.send(new ScanCommand(params));

    return (
      result.Items?.map((item) => ({
        id: item.id.S,
        nomeCompleto: item.nomeCompleto.S,
        dataNascimento: item.dataNascimento.S,
        ativo: item.ativo.BOOL,
        enderecos: item.enderecos.SS,
        contatos: JSON.parse(item.contatos.S || '[]'),
      })) || []
    );
  }

  async buscarCliente(id: string): Promise<Cliente | null> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: { S: id },
      },
    };

    const result = await dynamoCliente.send(new GetItemCommand(params));

    if (!result.Item) {
      return null;
    }

    return {
      id: result.Item.id.S,
      nomeCompleto: result.Item.nomeCompleto.S,
      dataNascimento: result.Item.dataNascimento.S,
      ativo: result.Item.ativo.BOOL,
      enderecos: result.Item.enderecos.SS,
      contatos: JSON.parse(result.Item.contatos.S || '[]'),
    };
  }

  async atualizarCliente(
    id: string,
    updates: Partial<Cliente>,
  ): Promise<Cliente> {
    const cliente = await this.buscarCliente(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    Object.assign(cliente, updates);

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: { S: id },
      },
      UpdateExpression:
        'SET nomeCompleto = :nomeCompleto, dataNascimento = :dataNascimento, ativo = :ativo, enderecos = :enderecos, contatos = :contatos',
      ExpressionAttributeValues: {
        ':nomeCompleto': { S: cliente.nomeCompleto },
        ':dataNascimento': { S: cliente.dataNascimento },
        ':ativo': { BOOL: cliente.ativo },
        ':enderecos': { SS: cliente.enderecos },
        ':contatos': { S: JSON.stringify(cliente.contatos) },
      },
      ReturnValues: ReturnValue.ALL_NEW,
    };

    const resultado = await dynamoCliente.send(new UpdateItemCommand(params));

    return {
      id: resultado.Attributes.id.S,
      nomeCompleto: resultado.Attributes.nomeCompleto.S,
      dataNascimento: resultado.Attributes.dataNascimento.S,
      ativo: resultado.Attributes.ativo.BOOL,
      enderecos: resultado.Attributes.enderecos.SS,
      contatos: JSON.parse(resultado.Attributes.contatos.S || '[]'),
    };
  }

  async deletarCliente(id: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: { S: id },
      },
    };

    await dynamoCliente.send(new DeleteItemCommand(params));
  }
}
