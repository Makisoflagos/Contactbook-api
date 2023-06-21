const express = require ("express")
const mongoose = require ("mongoose")
PORT = 5015

const app = express();
app.use(express.json());

const contactList = new mongoose.Schema ({
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phoneNumber: {
            type: Number,
        },
        emailAddress: {
            type: String,
        }
})
const contact = mongoose.model("contactList", contactList);

mongoose.connect("mongodb+srv://amakaekeh15:50PZZiRDHTAC26xz@cluster0.pxljutc.mongodb.net/").then(() => {
    console.log(`Database connection is successful.`)
}).catch((error) => {
    console.log(error.message)
})

// create a contact detail

app.post("/contactbook", async (req, res) =>{
    try{
        const newContact = await contact.create(req.body);
        if ( !newContact ){
            res.status( 400 ).json ({
                Error: 'Error creating new Contact.'
            })
         } else {
            res.status (201).json(newContact)
         }
        
    }catch( e ){
        res.status( 400 ).json ({
            Message: e.message
        })
    }
})

// get all contact list

app.get('/allcontacts', async(req, res) => {
    try{
        const allContacts = await contact.find();
        if( allContacts.length === 0){
            res.status( 400 ).json ({
                Error: 'This Collection has no available data.'
            })
        } else {
            res.status( 201 ).json( allContacts )
        }
    }catch (e){
        res.status( 400 ).json ({
            Message: e.message
        })
    }

})

// get one contact 

app.get('/allcontacts/:contactId', async(req, res) => {
    try{
        const contactId = req.params.contactId;
        const allContacts = await contact.findById(contactId);
        if( !allContacts ){
            res.status( 400 ).json ({
                Error: `This ${contactId } does not exist`
            })
        } else {
            res.status( 201 ).json( allContacts )
        }
    }catch (e){
        res.status( 400 ).json ({
            Message: e.message
        })
    }

})

// update a contact

app.put( "/allcontacts/:contactId", async ( req, res ) => {
   
        const contactId = req.params.contactId;
        console.log(contactId)
        const allContact = req.body
        const  allContacts = await contact.findByIdAndUpdate( contactId, allContact);
    
        res.status( 200 ).json(
            { message: `Contact with this ${contactId} has been updated successfully.`,
            data: allContacts
    })
});

app.delete("/deleteacontact/:contactId", async(req, res) =>{
    const contactId = req.params.contactId
    const deletedContact = await contact.findByIdAndDelete(contactId)
    res.status(200).json({
        message: `The information of the user with the id of ${contactId} has been deleted`,
        deleted: deletedContact
    })
});

app.listen(PORT, () => {
    console.log(`Server is listening to ${PORT}`)
})