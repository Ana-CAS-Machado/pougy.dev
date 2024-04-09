const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configurar as credenciais do Amazon SES
AWS.config.update({
  accessKeyId: 'sua_chave_de_acesso',
  secretAccessKey: 'sua_chave_secreta',
  region: 'us-east-1' // Substitua pela região correta do Amazon SES
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

app.post('/enviar-email', (req, res) => {
  const { name, email, phone, message, ddd } = req.body;

  // Configurar os parâmetros do e-mail
  const params = {
    Destination: {
      ToAddresses: ['destinatario@exemplo.com'] // Insira o endereço de e-mail do destinatário
    },
    Message: {
      Body: {
        Text: {
          Data: `
            Nome: ${name}
            Email: ${email}
            Telefone: (${ddd}) ${phone}
            Mensagem: ${message}
          `,
        }
      },
      Subject: { Data: `Novo contato de ${name}` }
    },
    Source: 'seuemail@exemplo.com' // Insira seu endereço de e-mail do Amazon SES
  };

  // Enviar o e-mail
  ses.sendEmail(params, (error, data) => {
    if (error) {
      console.error('Erro ao enviar o e-mail:', error);
      res.status(500).send('Ocorreu um erro ao enviar o e-mail.');
    } else {
      console.log('E-mail enviado:', data);
      res.status(200).send('E-mail enviado com sucesso!');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
