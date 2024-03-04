const axios = require('axios');

const openApiKey = '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';
const openApiUrl = '';

const generateCL = async (inputData) => {
    try {
        const response = await axios.post(openApiUrl, {
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: inputData },
            ],
            model: 'gpt-3.5-turbo',  
         }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openApiKey}`,
            },
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            console.error('Response data:', error.response.data);
            return `Error: ${error.response.status}-${error.response.data}`;
        } else if (error.request) {
            console.error('No response received');
            return 'Error: No response received';
        } else {
            console.error('Error message:', error.message);
            return `Error: ${error.message}`;
        }
    }
};

module.exports = generateCL;
