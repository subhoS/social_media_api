const Pool = require("pg").Pool;

const pool = new Pool({
  user: "subhadeep",
  host: "localhost",
  database: "social",
  password: "password",
  port: 5432,
});



const ShowUsers = (request, response) => {
  console.log("hitting");
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    let object = {
      responsecode: "200",
      responsemessage: "allUsersShown",
      result: results.rows,
    };
    if (results.rows.length > 0) {
      response.status(200).json(object);
    } else {
      object.responsemessage = "nodata found";
      object.responsecode = "400";
      response.status(200).json(object);
    }
  });
};

const ShowActiveUsers = (request, response) => {
  console.log("hitting");
  pool.query(
    "SELECT * FROM users Where active = 1 ORDER BY id ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      let object = {
        responsecode: "200",
        responsemessage: "allUsersShown",
        result: results.rows,
      };
      if (results.rows.length > 0) {
        response.status(200).json(object);
      } else {
        object.responsemessage = "nodata found";
        object.responsecode = "400";
        response.status(200).json(object);
      }
    }
  );
};


const serchUserById = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query(
    `SELECT * FROM users Where id = ${id} ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        throw error;
      }
      let object = {
        responsecode: "200",
        responsemessage: "allUsersShown",
        result: results.rows,
      };
      if (results.rows.length > 0) {
        response.status(200).json(object);
      } else {
        object.responsemessage = "nodata found";
        object.responsecode = "400";
        response.status(200).json(object);
      }
    }
  );
};



const signUp = (request, response) => {
  const { active, name, email, mo_number } = request.body;
  pool.query(
    "INSERT INTO users (active,name,email,mo_number) VALUES ($1, $2 ,$3 ,$4)",
    [active, name, email, mo_number],
    (error, results) => {
      if (error) {
        throw error;
      }
      pool.query(
        "SELECT * from users where id=(select max(id) from users)",
        (err, data) => {
          if (err) {
            throw err;
          }
          let object = {
            responsecode: "200",
            responsemessage: "reg sucessfull",
            result: data.rows,
          };
          if (data.rows.length > 0) {
            response.status(200).json(object);
          } else {
            object.responsemessage = "Database related error";
            object.responsecode = "400";
            response.status(200).json(object);
          }
        }
      );
    }
  );
};

const softDelete = (request, response) => {
  console.log(request.body);
  const { id, active } = request.body;
  pool.query(
    "UPDATE users SET active = $2 WHERE id = $1",
    [id, active],
    (error, results) => {
      if (error) {
        throw error;
      }
      pool.query(
        `Select name,active from users where id=${id}`,
        (err, data) => {
          if (err) {
            throw err;
          }
          let object = {
            responsecode: "200",
            responsemessage: "User Activity changed",
            result: data.rows,
          };
          if (data.rows.length > 0) {
            response.status(200).json(object);
          } else {
            object.responsemessage = "error";
            object.responsecode = "400";
            response.status(200).json(object);
          }
        }
      );
    }
  );
};

const hardDelete = (request, response) => {
  const { id } = request.query;
  console.log(id)
  // const id = parseInt(request.params.id);
  console.log(id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    let object = {
      responsecode: "200",
      responsemessage: "your account has been deleted",
    };
    response.status(200).json(object);
  });
}; 


//[adminPostApi]

const viewAllPost = (request, response) => {
  console.log("hitting");
  pool.query("SELECT * FROM adminpost ORDER BY postid ASC", (error, results) => {
    if (error) {
      throw error;
    }
    let object = {
      responsecode: "200",
      responsemessage: "ALL Post Showned",
      result: results.rows,
    };
    if (results.rows.length > 0) {
      response.status(200).json(object);
    } else {
      object.responsemessage = "nodata found";
      object.responsecode = "400";
      response.status(200).json(object);
    }
  });
};

const postById = (request, response) => {
  const postid = parseInt(request.params.postid)
  console.log("hitting");
  pool.query(`SELECT * FROM adminpost Where postid= ${postid}`, (error, results) => {
    if (error) {
      throw error;
    }
    // console.log(results.rows[0].achive)
    
    // if (results.rows[0].achive == 1){
    //   results.rows[0].achive == 0
    // }else{
    //   results.rows[0].achive == 1
    // }
    
    let object = {
      responsecode: "200",
      responsemessage: "ALL Post Showned",
      result: results.rows,
    };


    if (results.rows.length > 0) {
      response.status(200).json(object);
    } else {
      object.responsemessage = "nodata found";
      object.responsecode = "400";
      response.status(200).json(object);
    }
  });
};

let id;

const archivePost = (request,response) => {
  const { postid } = request.body;
  console.log(postid)
  pool.query(`SELECT * FROM adminpost Where postid= ${postid}`,(error,results)=> {
    // console.log(results.rows)
    if (results.rows[0].achive == 1) {
      id = 0
    }else{
      id = 1
    }
    pool.query(`UPDATE adminpost set achive = ${id}`,(err,data) => {
      if (err) {
        throw err;
      }
      let object = {
        responsecode:"200",
        responsecode:"activity changed",
      };
      if (results.rows.length > 0) {
        response.status(200).json(object);
      } else {
        object.responsemessage = "Database related error";
        object.responsecode = "400";
        response.status(200).json(object);
      }
    })
  })

}

const uploadApi = (request, response) => {
  const { postname, content } = request.body;
  pool.query(
    "INSERT INTO adminpost (postname, content) VALUES ($1, $2)",
    [postname,content],
    (error, results) => {
      if (error) {
        throw error;
      }
      pool.query(
        "SELECT * from adminpost where id=(select max(id) from users)",
        (err, data) => {
          if (err) {
            throw err;
          }
          let object = {
            responsecode: "200",
            responsemessage: "the post have been uploaded ",
            result: data.rows,
          };
          if (data.rows.length > 0) {
            response.status(200).json(object);
          } else {
            object.responsemessage = "Database related error";
            object.responsecode = "400";
            response.status(200).json(object);
          }
        }
      );
    }
  );
};

const deletePost = (request, response) => {
  const { postid } = request.query;
  pool.query("DELETE FROM adminpost WHERE postid = $1", [postid], (error, results) => {
    if (error) {
      throw error;
    }
    let object = {
      responsecode: "200",
      responsemessage: "your post have been deleted",
    };
    response.status(200).json(object);
  });
};




module.exports = {
  ShowUsers,
  ShowActiveUsers,
  serchUserById,
  signUp,
  softDelete,
  hardDelete,
  viewAllPost,
  postById,
  archivePost,
  uploadApi,
  deletePost
};
