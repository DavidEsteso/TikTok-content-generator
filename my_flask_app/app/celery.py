from celery import Celery

app = Celery('app',
             broker='redis://localhost',
             backend='rpc://',
             include=['app.logic'])

# Optional configuration, see the application user guide.
app.conf.update(
    result_expires=3600,
)

if __name__ == '__main__':
    app.start()