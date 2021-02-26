---
name: java-restful-server
title: 用 Java 搭建 RESTful API 服务器
create-date: 2019-12-09
date: 2020-02-01
descriptions:
    - 面向对象的程序设计课程作业，选择 Jersey 框架进行开发
    - 本文为过程记录类文章，可能不会对代码进行详细解释，项目完整代码见 GitHub
tags:
    - Java
    - RESTful
license: CC-BY-SA-4.0
---

# 用 Java 搭建 RESTful API 服务器

📌 面向对象的程序设计课程作业，选择 Jersey 框架进行开发

📁 本文为过程记录类文章，可能不会对代码进行详细解释，项目完整代码见 [仓库](https://github.com/Lifeni/java-restful-api-server)

| TODO                                    | 状态   |
| --------------------------------------- | ------ |
| 搭建 Java 在 Windows 下的开发环境       | ✅ 完成 |
| 实现 POST GET PUT DELETE 四种 HTTP 方法 | ✅ 完成 |
| 连接数据库（MongoDB）                   | ✅ 完成 |

## 1. 配置开发环境

本地环境使用 Windows 下 Intellij IDEA 进行开发。

1. 下载 JDK 和 Maven 并配置环境变量。

2. 新建一个 Maven 项目，选择 `org.apache.maven.archetypes:maven-archetype-webapp`，并把 `Maven home directory` `User settings file` `Local repository` 改为下载好的文件位置，如果没有 repository 文件夹就新建一个。

3. 等 IDEA 自动配置完后在 pom.xml 中添加以下内容：

   ```xml
    <dependencies>
        <dependency>
            <groupId>org.glassfish.jersey.containers</groupId>
            <artifactId>jersey-container-servlet</artifactId>
            <version>2.29.1</version>
        </dependency>
        <dependency>
            <groupId>org.glassfish.jersey.core</groupId>
            <artifactId>jersey-client</artifactId>
            <version>2.29.1</version>
        </dependency>
        <dependency>
            <groupId>org.glassfish.jersey.media</groupId>
            <artifactId>jersey-media-json-jackson</artifactId>
            <version>2.29.1</version>
        </dependency>
        <dependency>
          <groupId>org.glassfish.jersey.inject</groupId>
          <artifactId>jersey-hk2</artifactId>
          <version>2.29.1</version>
        </dependency>
    </dependencies>
   ```

4. 在 `/src/main/webapp/WEB-INF/web.xml` 中添加以下代码：

   ```xml
    <servlet>
        <servlet-name>server</servlet-name>
        <servlet-class>org.glassfish.jersey.servlet.ServletContainer</servlet-class>
        <init-param>
            <param-name>jersey.config.server.provider.packages</param-name>
            <param-value>lfn.java</param-value>
        </init-param>
    </servlet>
    <servlet-mapping>
        <servlet-name>server</servlet-name>
        <url-pattern>/api/*</url-pattern>
    </servlet-mapping>
   ```

5. 添加文件夹：

   - `/src/main/java/` 存放 java 代码
   - `/src/main/resource/` 存放资源文件
   - `/src/test/java/`
   - `/src/test/resource/`

6. 在 `/src/main/java/` 文件夹下新建 Package，添加三个 Class：`MainService` `EventHandler` `DataModel`。

7. 目录结构如下（使用 `tree /f` 命令）：

   ```
    │  pom.xml
    │
    └─src
        ├─main
        │  ├─java
        │  │  └─lfn
        │  │      └─java
        │  │              DataModel.java
        │  │              EventHandler.java
        │  │              MainService.java
        │  │
        │  ├─resources
        │  └─webapp
        │      │  index.jsp
        │      │
        │      └─WEB-INF
        │              web.xml
        │
        └─test
            ├─java
            └─resources
   ```

## 2. 代码实现

### `MainService`

用于处理四种 HTTP 方法。

```java
package lfn.java;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;

@Path("/")
public class MainService {
    @GET
    @Path("/get")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMethod() {
        return EventHandler.find();
    }

    @GET
    @Path("/get/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMethod(@PathParam("id") String id) {
        return EventHandler.find(id);
    }

    @POST
    @Path("/post")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    @Produces(MediaType.APPLICATION_JSON)
    public String postMethod(String body) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            DataModel data = mapper.readValue(body, DataModel.class);
            return EventHandler.add(data);
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    @PUT
    @Path("/put/{id}")
    @Consumes({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
    @Produces(MediaType.APPLICATION_JSON)
    public String putMethod(String body, @PathParam("id") String id) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            DataModel data = mapper.readValue(body, DataModel.class);
            return EventHandler.update(data, id);
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    @DELETE
    @Path("/delete/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteMethod(@PathParam("id") String id) {
        return EventHandler.remove(id);
    }
}
```

### `EventHandler`

用于对接收数据进行处理并返回。

```java
package lfn.java;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class EventHandler {
    private static List<DataModel> list = new ArrayList<>();

    public static String add(DataModel data) {
        ObjectMapper mapper = new ObjectMapper();
        data.setId();
        data.setDate();
        list.add(data);
        try {
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String find() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String find(String id) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            for (DataModel data : list) {
                if (data.getId().equals(id)) {
                    return mapper.writeValueAsString(data);
                }
            }
            return "{\"status\":\"NOT FOUND\"}";
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String update(DataModel data, String id) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            for (DataModel d : list) {
                if (d.getId().equals(id)) {
                    d.setDate();
                    d.setUser(data.getUser());
                    d.setMessage(data.getMessage());
                    return mapper.writeValueAsString(d);
                }
            }
            return "{\"status\":\"NOT FOUND\"}";
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String remove(String id) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            for (DataModel data : list) {
                if (data.getId().equals(id)) {
                    list.remove(data);
                    return mapper.writeValueAsString(data);
                }
            }
            return "{\"status\":\"NOT FOUND\"}";
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }
}
```

### `DataModel`

建立数据模型，`user` 和 `message` 为传入字段，`id` 随机生成，`date` 在传入后设定。

```java
package lfn.java;

import java.util.Date;

public class DataModel {
    private String id;
    private String date;
    private String user;
    private String message;

    public DataModel() {
        // NO ACTION
    }

    public DataModel(String user, String message) {
        this.user = user;
        this.message = message;
    }

    public void setId() {
        String id = String.valueOf((int) (Math.random() * 10000));
        this.id = id;
    }

    public void setDate() {
        Date date = new Date();
        String d = date.toString();
        this.date = d;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public String getDate() {
        return date;
    }
}
```

## 3. 连接数据库

上面的程序应该可以正常运行，下面连接 MongoDB 数据库。

关于如何安装和启动数据库，这里不再叙述，请自行查找。

### 1. 添加依赖

驱动最新版本：[MongoDB Java Driver](https://mongodb.github.io/mongo-java-driver/)

在 pom.xml 中添加以下语句，IDEA 会自动添加依赖。

```xml
<dependency>
    <groupId>org.mongodb</groupId>
    <artifactId>mongodb-driver-sync</artifactId>
    <version>3.12.0</version>
</dependency>
```

### 2. 连接数据库

新建一个类 `DBHandler`，用于处理数据库相关操作。

```java
package lfn.java;

import com.mongodb.client.*;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

public class DBHandler {
    private static MongoCollection<Document> collection;
    public static void run() {
        try {
            MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
            MongoDatabase database = mongoClient.getDatabase("java");
            collection = database.getCollection("test");
            System.out.println("Connect to Datebase.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void add(DataModel data) {
        run();
        try {
            Document document = new Document("id", data.getId())
                    .append("date", data.getDate())
                    .append("user", data.getUser())
                    .append("message", data.getMessage());
            // System.out.println(document);
            // System.out.println(collection);
            List<Document> documents = new ArrayList<Document>();
            documents.add(document);
            collection.insertMany(documents);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static List<Document> find() {
        run();
        List<Document> documents = new ArrayList<Document>();
        try {
            FindIterable<Document> findIterable = collection.find();
            MongoCursor<Document> mongoCursor = findIterable.iterator();
            while (mongoCursor.hasNext()) {
                Document document = mongoCursor.next();
                document.remove("_id");
                documents.add(document);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return documents;
    }

    public static Document find(String id) {
        run();
        try {
            FindIterable<Document> findIterable = collection.find();
            MongoCursor<Document> mongoCursor = findIterable.iterator();
            while (mongoCursor.hasNext()) {
                Document document = mongoCursor.next();
                if (document.get("id").equals(id)) {
                    document.remove("_id");
                    return document;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Document update(String id, DataModel temp) {
        run();
        try {
            collection.updateOne(Filters.eq("id", id),
                        Updates.combine(Updates.set("id", id),
                            Updates.set("date", temp.getDate()),
                            Updates.set("user", temp.getUser()),
                            Updates.set("message", temp.getMessage())));
            FindIterable<Document> findIterable = collection.find();
            MongoCursor<Document> mongoCursor = findIterable.iterator();
            while (mongoCursor.hasNext()) {
                Document document = mongoCursor.next();
                if (document.get("id").equals(id)) {
                    document.remove("_id");
                    return document;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Document remove(String id) {
        run();
        try {
            FindIterable<Document> findIterable = collection.find();
            MongoCursor<Document> mongoCursor = findIterable.iterator();
            while (mongoCursor.hasNext()) {
                Document document = mongoCursor.next();
                if (document.get("id").equals(id)) {
                    collection.deleteOne(Filters.eq("id", id));
                    document.remove("_id");
                    return document;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

### 3. 修改 `EventHandler`

把之前的 List 删除，之后的代码直接调用 `DBHandler` 中的方法即可。

```java
public class EventHandler {
    public static String add(DataModel data) {
        ObjectMapper mapper = new ObjectMapper();
        data.setId();
        data.setDate();
        DBHandler.add(data);
        try {
            return mapper.writeValueAsString(data);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String find() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.writeValueAsString(DBHandler.find());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String find(String id) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Document document = DBHandler.find(id);
            if (document == null) {
                return "{\"status\":\"NOT FOUND\"}";
            }
            return mapper.writeValueAsString(document);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String update(DataModel data, String id) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            DataModel temp = data;
            temp.setDate();
            Document document = DBHandler.update(id, temp);
            if (document == null) {
                return "{\"status\":\"NOT FOUND\"}";
            }
            return mapper.writeValueAsString(document);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }

    public static String remove(String id) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Document document = DBHandler.remove(id);
            if (document == null) {
                return "{\"status\":\"NOT FOUND\"}";
            }
            return mapper.writeValueAsString(document);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{\"status\":\"ERROR\"}";
        }
    }
}
```

## 4. 测试

### 使用 Tomcat 建立服务器

1. 下载并配置环境变量。
2. 在 IDEA 右上角 Add Configuration... 中，点左上角加号，向下找到 Tomcat Server --> local，更改相应数据后 Apply。
3. 绿色三角运行，浏览器输入之前 URL 的值，查看是否出现 index.jsp 中对应网页（默认出现 hello, world）。

Tomcat 会根据打包成 war 文件的文件名来确定地址，我这里的打包文件为 server.war，网址是 http://localhost:8080/server/api/get 。

### 使用工具进行测试

可以使用浏览器或者 Postman 之类的软件进行测试。

### 用 Java 写一个测试工具

1. **配置开发环境**

同样使用 Intellij IDEA 进行开发。

1. 新建项目 Gradle --> Java，等待 IDEA 自动配置。
2. 新建项目文件夹，目录结构与上一个相同。
3. 右键添加的 java 目录，New --> Swing UI Designer --> GUI Form，选择一个布局管理器，我用的是 GridBagLayout，命名为 GUI。
4. 在 GUI.form 中添加几个部件，回到 GUI.java，右键 Class 空白处，Generate --> Form main()，然后运行即可。

这里可能会报错，可以在 Settings 里搜索 Gradle，把 Build and run 改为 IDEA，把 Gradle JVM 改为项目相同。

2. **设计 GUI**

IDEA 自动添加代码：Settings 里搜索 GUI Designer，改为 Java source code。

这里如果组件内中文乱码，可能是字体问题。

3. **设计事件**

代码过长，此处省略，可以直接去看 [项目代码](https://github.com/Lifeni/java-restful-api-server) 中的 `gui` 部分。
