## 버전

`node:18`

## Running the app

데모를 실행할 때는 docker-compose up로 실행해주세요.

```
docker-compose up
```

<br>

테스트 코드를 실행할 때는 npm run test로 실행해주세요.

```
yarn run test | npm run test
```

<br>

어드민, 테스트 유저 계정 생성 시 해당 API를 실행해주세요.

```
POST http://localhost:3000/api/users/mock

admin
- email: "test@naver.com"
- password: "test"

test
- email: "test2@naver.com"
- password: "test"
```

<br>

## API

API 명세 링크 (request, response type을 확인할 수 있습니다.)
https://documenter.getpostman.com/view/13091019/2s9Yyv9f7t

#### Auth

로그인 API (POST http://localhost:3000/api/auth/login)

#### Item

보너스 하트 충전 API (POST http://localhost:3000/api/items/bonus)

일반 하트 충전 API (POST http://localhost:3000/api/items/common?count=값)

보너스 하트 유효기간 수정 API (PATCH http://localhost:3000/api/items/:itemId/bonus)

#### User

어드민, 테스트 유저 계정 생성 (POST http://localhost:3000/api/users/mock)

유저의 하트 잔고를 볼 수 있는 API (GET http://localhost:3000/api/users/items)

하트 충전 내역 API (GET http://localhost:3000/api/users/orders)

하트 사용 API (PATCH http://localhost:3000/api/users/item-use?count=값)

<br>

## 동시성 문제

<Br>

<img width="1377" alt="image" src="https://github.com/onejaejae/devops-practice/assets/62149784/15e3a134-92da-4feb-bce8-6578d7a8adef">

<br>

postgres의 경우 isolation level이 Repeatable Read 레벨일 경우, "first-updater-win" 규칙을 따르기 때문에 동시 요청이 발생했을 때, rollback이 발생하였습니다.

<br>

<img width="942" alt="스크린샷 2024-02-01 오후 4 25 38" src="https://github.com/onejaejae/devops-practice/assets/62149784/779cc314-14e5-4370-a6f7-77e5a365dafa">

<br>

rollback을 방지하기 위해 redis를 사용해 분산 락을 구현하여 동시성 문제를 제어하였습니다.

<br>

## Workflow 및 구현 패턴

### 공통 기능

- Transactional Decorator 구현
- ErrorInterceptor, TypeORMException, TypeORMExceptionFilter 구현
- GenericTypeormRepository 구현

<br>

### 1. Transactional decorator with cls-hooked

#### 구현 방식

`cls-hooked`는 요청이 들어올 때 마다 Namespace라는 곳에 context를 생성하여 해당 요청만 접근할 수 있는 공간을 만들어줍니다. 이후 요청이 끝나면 해당 context를 닫아줍니다. 이를 이용해 요청이 들어오면 해당 요청에서만 사용할 entityManager를 생성하여 Namespace에 넣어 transaction decorator를 구현하였습니다.

1. Namespace 생성 후 EntityManager를 심어주는 `TransactionMiddleware`

2. Namespace에 있는 EntityManager에 접근할 수 있는 헬퍼 `TransactionManager`

3. origin method를 transaction으로 wrapping 하는 `Transaction Decorator`

<Br>

#### flow

<img width="1111" alt="transaction derocator flow with cls" src="https://github.com/onejaejae/learn_datastructure/assets/62149784/85d7d9a3-d766-497f-80ac-afb673833d04">

<br>

1. 요청이 들어오면, Modules에서 등록한 TransactionMiddleware을 통해 cls-hooked를 사용해 해당 요청에 대한 namespace에 EntityManager를 등록

2. Service에서 Transactional decorator를 사용하는 method에 class 인스턴스 생성 이전 시점에 접근해 Origin method를 Transaction Method로 wrapping

3. TransactionManage를 통해 Repository에서 Transaction이 시작된 EntityManager를 꺼내와 transaction 및 original Function 실행

#### Transaction Middleware example

1. 요청이 들어오면, 해당 요청에 대한 nameSpace가 존재하는 지 확인 후, 존재하지 않는다면, nameSpace를 생성합니다.

2. 해당 요청에 대한 nameSpace에 주입받은 EntityManager를 등록합니다.

#### Transactional Decorator example

1.  Transactional decorator를 사용하는 method에 class 인스턴스 생성 이전 시점에 접근합니다.

2.  transactionWrapped function에서 해당 요청에 대한 nameSpace에 접근한 뒤, middleware에서 등록한 EntityManager에 접근합니다.

3.  EntityManager의 transaction 메소드를 실행시킨 후 Transaction 헬퍼에서 꺼내 쓸 수 있도록 callback인자로 받은 Transaction이 시작된 EntityManager를 nameSpace에 넣어줍니다.

4.  origin method를 Transaction Method로 변경해줍니다.

#### TransactionManager example

baseRepository에서는 TransactionManager를 주입받아, Transaction이 시작된 EntityManager에 접근할 수 있습니다.

<br>

### 2. Error Interceptor

####

- `ErrorInterceptor`, `TypeORMExceptionFilter`, `TypeORMException`, `GeneralException`을 구현하여 HttpException과 TypeORMError를 효과적으로 처리할 수 있도록 구현하였습니다.

#### ErrorInterceptor Example

- ErrorInterceptor에서 rxjs의 catchError 연산자를 사용하여 응답 후 발생하는 오류를 `HttpException`과 `TypeORMError`에 따라 적절히 처리하도록 구현하였습니다.

- 만약 발생하는 오류가 `TypeORMError`라면, 해당 오류를 `TypeORMException`으로 래핑하여 던져주게 됩니다. 이렇게 함으로써 `TypeORMExceptionFilter에서 해당 예외를 적절히 처리할 수 있게 됩니다.

<br>

### 3. GenericTypeOrmRepository

#### 구현 방식

GenericTypeOrmRepository를 구현해 공통적으로 사용되는 데이터베이스 작업을 캡슐화하여 코드의 중복을 줄이고 재사용성을 높이고자 하였습니다.

또한 Base Repository 내에서 트랜잭션 관리를 할 수 있도록 구현하여, 데이터베이스 작업이 모두 같은 트랜잭션 내에서 실행되도록 보장해 데이터 일관성과 안전성을 유지하고자 하였습니다.

#### GenericTypeOrmRepository, postRepository example

- GenericTypeOrmRepository 상속받는 자식 repository에서 abstract getName method를 구현하도록 설계하여, 자식 repository entity name에 접근 가능하도록 하였습니다.

- getRepository method를 구현해 주입받은 TransactionManager 통해 Transaction이 시작된 EntityManager에 접근할 수 있도록 하였습니다.

<br>

### 4. Configuration

#### 구현 방식

환경 변수와 관련된 로직들을 Config module에서 구현하였습니다. 환경 변수가 필요한 곳에서 ConfigService를 주입받아 사용할 수 있습니다.
<br>

또한 환경 변수 타입을 적용하여 새로운 설정을 추가, 수정 삭제 시 보다 안전하게 환경 변수를 관리할 수 있습니다.

<br>

### 5. Pagination

- pagination 기능을 공통적으로 처리하기 위해, PaginationRequest, PaginationResponse, PaginationBuilder class를 구현하였습니다.

<br>

### 6. Dependency Injection

- Controller, Service 계층에서 생성자를 통한 의존성 주입 시, interface를 통한 DI를 구현하였습니다.

#### 얻을 수 있는 이점

- interface를 통한 DI를 통해, 테스트하기 용이한 환경을 만들 수 있습니다. 예를 들어 유닛 테스트 시, 테스트용 목(mock) 객체를 주입하여 테스트하기 용이하게 만듭니다.

- 모종의 이유로 다른 DB를 사용할 경우, 그로 인한 변경을 최소화 할 수 있습니다. service는 실제적인 구현체가 아닌 interface에 의존하고 있기 때문입니다.

<br>

=> 코드의 결합도를 낮추고, 변경에 유연하게 대처할 수 있으며 테스트하기 용이한 아키텍처를 고민하며 코드를 작성하였습니다.

<br>

## Testing

총 54개의 테스트 코드를 구현하였습니다.

#### 사용 라이브러리

- @golevelup/ts-jest
- jest-mock-extended
- sqlite3
- @testcontainers/postgresql

#### 구현 방식

- test/factory 폴더에서는 테스트 환경에서 테스트 데이터 생성 및 조작 기능을 담당합니다.

- 이를 통해 테스트 데이터 생성을 표준화하고 여러 테스트 코드에서 재사용할 수 있도록하여, 코드 중복을 피하고 테스트 코드의 유지보수를 용이하게 하고자 구현하였습니다.
