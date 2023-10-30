
import axios from 'axios';

export default async (req, res) => {
    console.log(`--------\nReceived event to /api/peoplematch\n--------`);

    // Get Apollo API key from environment variable
    const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY;


    // Return an error if the request is not a GET request
    // Maintaining same GET method as the Apollo API
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    // Extract the eventId and inviteeId from the request query parameters
    const {
        query: { eventId, inviteeId },
      } = req;

    // Return an error if the email is not included in the request body
    if (!eventId) {
        return res.status(400).json({ error: 'EventId is required' });
    }
    if (!inviteeId) {
        return res.status(400).json({ error: 'InviteId is required' });
    }

    try {
        // Call Apollo's /people/match endpoint to find the organization associated with the email
        const response = await axios.get(`https://api.calendly.com/scheduled_events/${eventId}/invitees/${inviteeId}`, {
            headers: {
                Authorization: 'Bearer ' + CALENDLY_API_KEY //the token is a variable which holds the token
            }
        });

        // give me code for axios get request with authorization header
        // https://stackoverflow.com/questions/45578844/how-to-pass-authorization-header-in-axios

        
        // Extract the 'email' data from Calendly's response
        const emailData = response.data.resource.email;

        // Return the organization data
        return res.status(200).json({ email: emailData });
    } catch (error) {
        // Return the error to the client
        const statusCode = error.response?.status || 500;
        const data = error.response?.data || {};

        console.error(`Error get from Calendly: ${error.message}. Status code: ${statusCode}. Data: ${JSON.stringify(data)}`);

        return res.status(statusCode).json(data);
    }
}
