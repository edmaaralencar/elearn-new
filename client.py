import socket as s

def checksum(data):
    """Calcula o checksum dos dados enviados."""
    byte_count = len(data)
    # verifica se o número de bytes é ímpar e adiciona um byte nulo (caso seja) para tornar par
    if byte_count % 2 == 1:
        data += b'\x00'
    checksum_value = 0
    # Itera sobre os dados em pares de bytes
    for i in range(0, len(data), 2):
        # Combina dois bytes em uma palavra de 16 bits e adiciona ao valor do checksum
        w = (data[i] << 8) + data[i + 1]
        checksum_value += w
        # Se houver overflow, adiciona a parte excedente ao valor do checksum
        checksum_value = (checksum_value >> 16) + (checksum_value & 0xFFFF)
    # Complementa o valor do checksum e o trunca para 16 bits
    checksum_value = ~checksum_value & 0xFFFF
    return checksum_value

if __name__ == "__main__":
    # Obtém o endereço IP do host local e define a porta
    HOST = s.gethostbyname(s.gethostname())
    PORT = 8080
    # Cria um socket UDP
    client = s.socket(s.AF_INET, s.SOCK_DGRAM)
    addr = (HOST, PORT)

    while True:
        # Solicita ao usuário uma palavra para envio
        data = input("Digite uma palavra: ")
        if not data:
            break
        # Codifica a palavra para UTF-8
        data = data.encode("utf-8")

        # Solicita ao usuário o modo de envio
        send_mode = input("Modo de envio (isolado/lote): ")

        if send_mode == "isolado":
            # Calcula o checksum da palavra e o converte em bytes
            checksum_value = checksum(data)
            checksum_bytes = checksum_value.to_bytes(2, byteorder="big")
            # Cria o pacote adicionando o checksum aos dados
            packet = checksum_bytes + data
            # Envia o pacote para o endereço especificado
            client.sendto(packet, addr)
        elif send_mode == "lote":
            # Cria uma lista para armazenar os pacotes
            packets = []
            while True:
                # Solicita ao usuário uma palavra (ou linha vazia para finalizar)
                additional_data = input("Digite uma palavra (ou linha vazia para finalizar): ")
                if not additional_data:
                    break
                # Codifica a palavra adicional para UTF-8
                additional_data = additional_data.encode("utf-8")
                # Calcula o checksum da palavra adicional e o converte em bytes
                checksum_value = checksum(additional_data)
                checksum_bytes = checksum_value.to_bytes(2, byteorder="big")
                # Adiciona o checksum aos dados e armazena o pacote na lista
                packets.append(checksum_bytes + additional_data)

            for packet in packets:
                # envia cada pacote para o seu endereço 
                client.sendto(packet, addr)
                # espera por uma resposta do servidor
                response, _ = client.recvfrom(1024)
                response = response.decode("utf-8")
                # verifica se a resposta apresenta erro de integridade
                if response == "ERRO":
                    print("Falha de integridade detectada.")
                else:
                    # exibe o comprimento da resposta, caso não tenha erro
                    print(f"Comprimento da resposta: {len(response)}")
        else:
            # mensagem de erro se o modo de envio não for reconhecido
            print("Modo de envio não reconhecido.")

    # Fecha o socket do cliente após a conclusão da comunicação
    client.close()